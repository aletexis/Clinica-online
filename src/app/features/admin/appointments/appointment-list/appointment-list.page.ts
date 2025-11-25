import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { combineLatest, take } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../../../core/services/alert.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Appointment } from '../../../../core/models/appointment';
import { AppointmentStatusPipe } from '../../../../shared/pipes/appointment-status.pipe';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import { StatusBadgeDirective } from '../../../../shared/directives/status-badge.directive';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-appointment-list.page',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    AppointmentStatusPipe,
    FormatDatePipe,
    StatusBadgeDirective
  ],
  templateUrl: './appointment-list.page.html',
  styleUrl: './appointment-list.page.scss'
})
export class AppointmentListPage {

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];

  specialistsList: { uid: string; name: string }[] = [];
  patientsList: { uid: string; name: string }[] = [];
  specialtiesList: string[] = [];

  searchTerm: string = '';

  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;
  selectedAppointment!: Appointment;

  @ViewChild('cancelDialog') cancelDialog!: TemplateRef<any>;
  cancelComment: string = '';
  maxCommentLength: number = 250;

  constructor(
    private firestoreService: FirestoreService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loadingService.startLoading();

    const specialists$ = this.firestoreService.getFiltered<{ uid: string; firstName: string; lastName: string }>(
      'users', 'role', 'specialist'
    );
    const patients$ = this.firestoreService.getFiltered<{ uid: string; firstName: string; lastName: string }>(
      'users', 'role', 'patient'
    );
    const appointments$ = this.firestoreService.getAll<Appointment>('appointments');

    combineLatest([specialists$, patients$, appointments$]).pipe(take(1)).subscribe({
      next: ([specialists, patients, apps]) => {
        this.specialistsList = specialists.map(s => ({ uid: s.uid, name: `${s.firstName} ${s.lastName}` }));
        this.patientsList = patients.map(p => ({ uid: p.uid, name: `${p.firstName} ${p.lastName}` }));

        this.appointments = apps;
        this.filteredAppointments = [...apps];

        this.specialtiesList = Array.from(new Set(apps.map(a => a.specialty)));
        this.loadingService.stopLoading();
      },
      error: err => {
        console.error(err);
        this.alertService.error('Error al cargar turnos');
        this.loadingService.stopLoading();
      }
    });
  }

  getPatientName(uid: string): string {
    return this.patientsList.find(p => p.uid === uid)?.name ?? uid;
  }

  getSpecialistName(uid: string): string {
    return this.specialistsList.find(s => s.uid === uid)?.name ?? uid;
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = value;

    this.filteredAppointments = this.appointments.filter(app => {
      const specialty = app.specialty?.toLowerCase() || '';
      const specialist = this.getSpecialistName(app.specialistUid).toLowerCase();

      return (
        specialty.includes(value) ||
        specialist.includes(value)
      );
    });
  }

  canCancel(app: Appointment): boolean {
    return app.status === 'pending' || app.status === 'accepted';
  }

  openCancelDialog(app: Appointment) {
    this.cancelComment = '';

    this.dialog.open(this.cancelDialog, {
      data: { app },
      width: '450px'
    });
  }

  get isCommentTooLong(): boolean {
    return this.cancelComment?.length >= this.maxCommentLength;
  }

  cancelAppointment(app: Appointment) {
    console.log("Cancelar turno con comentario:", this.cancelComment);
    console.log("app:", app);
    app.uid = app.id;
    const updated: Partial<Appointment> = {
      status: 'cancelled',
      adminCancellationComment: this.cancelComment,
    };

    console.log("id a cancelar:", app.uid);
    console.log("id a cancelar:", app.id);

    this.firestoreService.update('appointments', app.uid!, updated)
      .then(() => {
        this.alertService.success('Turno cancelado con éxito');
        this.dialog.closeAll();
        this.loadAppointments();
      })
      .catch(() => {
        this.alertService.error('Hubo un problema al cancelar el turno');
      });
  }

  openDetail(app: Appointment) {
    this.selectedAppointment = app;
    this.dialog.open(this.detailDialog, {
      width: '500px'
    });
  }
}