import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SpecialistAvailability, TimeRange } from '../../../../core/models/specialistAvailability';
import { PatientUser, SpecialistUser } from '../../../../core/models/user';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { AmPmTimePipe } from '../../../../shared/pipes/am-pm-time.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { DefaultImagePipe } from '../../../../shared/pipes/default-image.pipe';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment';
import { map, take } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-create-appointment.page',
  imports: [
    CommonModule,
    RouterModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AmPmTimePipe,
    DefaultImagePipe
  ],
  templateUrl: './create-appointment.page.html',
  styleUrl: './create-appointment.page.scss'
})
export class CreateAppointmentPage {

  // Paso 1 - 2
  specialists: SpecialistUser[] = [];
  selectedSpecialist: SpecialistUser | null = null;
  isLoadingSpecialistsImages = true;

  specialties: Specialty[] = [];
  selectedSpecialty: Specialty | null = null;

  // Paso 3 - 4
  specialistAvailability: SpecialistAvailability | null = null;
  availableDays: string[] = [];
  selectedDay: string | null = null;

  availableTimes: string[] = [];
  selectedTime: string | null = null;
  takenTimes: string[] = [];

  // Paso 5
  isAdmin = false;
  patients: PatientUser[] = [];
  selectedPatient: PatientUser | null = null;


  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private alertService: AlertService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
      if (this.isAdmin) this.loadPatients();
    });

    this.loadSpecialists();
  }

  // Paso 1 - 2

  loadSpecialists() {
    this.isLoadingSpecialistsImages = true;

    this.firestoreService.getFiltered<SpecialistUser>('users', 'role', 'specialist')
      .subscribe(specialists => {
        this.specialists = specialists;

        if (specialists.length === 0) {
          this.isLoadingSpecialistsImages = false;
          return;
        }

        let loadedCount = 0;

        specialists.forEach((spec, index) => {
          const img = new Image();

          img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === specialists.length) {
              this.isLoadingSpecialistsImages = false;
            }
          };

          img.src = spec.profileImgs?.[0] ?? '';

          this.checkSpecialistAvailability(spec.uid).then(has => {
            spec.hasAvailability = has;
          });
        });
      });
  }

  onSelectSpecialist(specialistUser: SpecialistUser) {
    this.selectedSpecialist = specialistUser;
    this.selectedSpecialty = null;
    this.selectedDay = null;
    this.selectedTime = null;
    this.specialistAvailability = null;

    this.loadSpecialties(specialistUser.specialties);
    this.loadAvailability(specialistUser.uid);
  }

  loadSpecialties(ids: string[]) {
    this.firestoreService.getAll<Specialty>('specialties')
      .subscribe(all => {
        this.specialties = all.filter(s => ids.includes((s as any).id));
      });
  }

  onSelectSpecialty(s: Specialty) {
    this.selectedSpecialty = s;
    this.selectedDay = null;
    this.selectedTime = null;
    this.generateAvailableDays();
  }

  // Paso 3 - 4
  loadAvailability(uid: string) {
    this.firestoreService.getFiltered<SpecialistAvailability>('specialistAvailability', 'uid', uid)
      .subscribe(res => {

        if (res.length === 0) {
          this.specialistAvailability = null;
          this.availableDays = [];
          this.availableTimes = [];
          return;
        }

        this.specialistAvailability = res[0];
        this.generateAvailableDays();
      });
  }

  generateAvailableDays() {
    if (!this.specialistAvailability) {
      this.availableDays = [];
      return;
    }

    const next15 = this.getNext15Days();

    this.availableDays = next15
      .filter(date => {
        const weekday = this.getWeekdayName(date);

        const matches = this.specialistAvailability!.availability.some(a =>
          a.day === weekday &&
          a.ranges &&
          a.ranges.some(r => r.start && r.end)
        );

        return matches;
      })
      .map(date => {
        const f = this.formatDate(date);
        return f;
      });
  }

  onSelectDay(day: string) {
    this.selectedDay = day;
    this.selectedTime = null;
    this.generateAvailableTimes();
  }

  generateAvailableTimes() {
    if (!this.specialistAvailability || !this.selectedDay || !this.selectedSpecialist) {
      this.availableTimes = [];
      this.takenTimes = [];
      return;
    }

    const weekday = this.getWeekdayNameFromFormatted(this.selectedDay);
    const dayObj = this.specialistAvailability.availability.find(d =>
      d.day === weekday &&
      d.ranges.some((r: TimeRange) => r.start && r.end)
    );

    if (!dayObj) {
      this.availableTimes = [];
      this.takenTimes = [];
      return;
    }

    const slots: string[] = [];
    dayObj.ranges.forEach((r: TimeRange) => {
      if (r.start && r.end) {
        slots.push(...this.generateSlots(r.start, r.end));
      }
    });

    this.firestoreService
      .getFiltered<Appointment>('appointments', 'specialistUid', this.selectedSpecialist.uid)
      .pipe(take(1))
      .subscribe(apps => {
        const activeStatuses: AppointmentStatus[] = ['pending', 'accepted'];
        const taken = apps
          .filter(a => a.date === this.selectedDay && activeStatuses.includes(a.status))
          .map(a => a.time);

        this.takenTimes = taken;
        this.availableTimes = slots;
      });
  }

  generateSlots(start: string, end: string): string[] {
    const result: string[] = [];
    let [sh, sm] = start.split(':').map(Number);
    let [eh, em] = end.split(':').map(Number);

    let cur = new Date();
    cur.setHours(sh, sm, 0, 0);

    const limit = new Date();
    limit.setHours(eh, em, 0, 0);

    while (cur < limit) {
      result.push(cur.toTimeString().slice(0, 5));
      cur.setMinutes(cur.getMinutes() + 30);
    }
    return result;
  }

  onSelectTime(t: string) {
    this.selectedTime = t;
  }

  // Paso Admin

  loadPatients() {
    this.firestoreService.getFiltered<PatientUser>('users', 'role', 'patient')
      .subscribe(list => {
        const currentAdminUid = this.authService.userSubject.getValue()?.uid;
        this.patients = list.filter(p => p.uid !== currentAdminUid);
      });
  }

  onSelectPatient(p: PatientUser) {
    this.selectedPatient = p;
  }

  confirmAppointment() {
    if (!this.selectedSpecialist || !this.selectedSpecialty || !this.selectedDay || !this.selectedTime) {
      this.alertService.error('Faltan datos para confirmar el turno');
      return;
    }

    const specialist = this.selectedSpecialist!;
    const specialty = this.selectedSpecialty!;
    const day = this.selectedDay!;
    const time = this.selectedTime!;

    const currentUserUid = this.authService.userSubject.value?.uid ?? null;
    const patientUid = this.isAdmin ? this.selectedPatient?.uid ?? null : currentUserUid;

    if (!patientUid) {
      this.alertService.error('No se pudo obtener el paciente');
      return;
    }

    this.firestoreService
      .getFiltered<Appointment>('appointments', 'patientUid', patientUid)
      .pipe(take(1))
      .subscribe(allApps => {

        const activeStatuses: AppointmentStatus[] = ['pending', 'accepted'];
        const sameDaySameSpecialist = allApps.filter(a =>
          activeStatuses.includes(a.status) &&
          a.specialistUid === specialist.uid &&
          a.date === day
        );

        if (sameDaySameSpecialist.length >= 2) {
          this.alertService.error('El paciente ya tiene 2 turnos con este especialista en el mismo día', 4000);
          return;
        }

        const appointment: Appointment = {
          patientUid,
          specialistUid: specialist.uid!,
          specialty: specialty.name,
          date: day,
          time: time,
          status: 'pending',
          createdAt: new Date(),
        };

        if (this.isAdmin && this.selectedPatient) {
          appointment.adminCreatedForPatientUid = this.selectedPatient.uid;
        }

        this.firestoreService.create<Appointment>('appointments', appointment)
          .then(() => {
            this.alertService.success('Turno creado con éxito');
            this.location.back();
          })
          .catch(err => {
            console.error(err);
            this.alertService.error('Hubo un problema al crear el turno');
          });
      });
  }

  //helpers

  async checkSpecialistAvailability(uid: string): Promise<boolean> {
    return new Promise(resolve => {
      this.firestoreService
        .getFiltered<SpecialistAvailability>('specialistAvailability', 'uid', uid)
        .subscribe(av => {
          if (!av.length) return resolve(false);

          const has = av[0].availability.some(d =>
            d.ranges.some(r => r.start && r.end)
          );

          resolve(has);
        });
    });
  }

  formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const formatted = `${dd}-${mm}-${yyyy}`;
    return formatted;
  }

  getNext15Days(): Date[] {
    const days: Date[] = [];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }

    return days;
  }

  getWeekdayName(date: Date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const result = days[date.getDay()];
    return result;
  }

  getWeekdayNameFromFormatted(dateStr: string): string {
    const [d, m, y] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  }

  getPatientActiveAppointments(patientUid: string) {
    return this.firestoreService.getFiltered<Appointment>('appointments', 'patientUid', patientUid)
      .pipe(
        map(apps => apps.filter(a => a.status === 'pending' || a.status === 'accepted'))
      );
  }
}