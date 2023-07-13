import { MedicalRecord } from '../../../classes/medical-record';
import { Patient } from '../../../classes/patient';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Specialty } from 'src/app/classes/specialty';
import { Specialist } from 'src/app/classes/specialist';
import { Appointment } from 'src/app/classes/appointment';
import { AuthService } from 'src/app/services/auth.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  specialists: Specialist[] = [];
  specialties: Specialty[] = [];
  patients: Patient[] = [];
  user!: User;
  filterBy = 'Sin filtro';

  private unsub: Subscription = new Subscription();

  constructor(public authService: AuthService, private appointmentsService: AppointmentsService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.utilsService.getUser(this.authService.user!.mail).then((user) => {
      this.user = user;
    });
    this.unsub = this.appointmentsService
      .getAppointments(this.authService.user!)
      .subscribe((doc) => {
        this.appointments = [];
        this.appointments = doc as Appointment[];
        this.filteredAppointments = this.appointments;
        this.utilsService.getSpecialists().forEach((specialist) => {
          this.specialists = specialist as Specialist[];
        });
        this.utilsService.getSpecialties().forEach((specialist) => {
          this.specialties = specialist as Specialty[];
        });
        this.utilsService.getPatients().forEach((patient) => {
          this.patients = patient as Patient[];
        });
      });
  }

  ngOnDestroy(): void {
    this.unsub.unsubscribe();
  }

  showComment(comment: string) {
    Swal.fire('Comentario del turno: ', '"' + comment + '"', 'info');
  }

  showDiagnosis(comment: string, diagnosis: string, key: string, value: string) {
    Swal.fire(
      'Información de la atención: ',
      'Diagnóstico: "' +
      diagnosis +
      '<div style="height: 10px;"></div>' +
      'Comentario: "' +
      comment +
      '"' +
      '<div style="height: 10px;"></div>' +
      key +
      ': ' +
      value,
      'info'
    );
  }

  cancelAppointment(appointment: Appointment) {
    Swal.fire({
      title: '¿Por qué cancelás el turno?',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Cancelar turno',
      cancelButtonText: 'No cancelar turno',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.length !== 0) {
          this.appointmentsService.cancelAppointment(appointment, result.value);
        } else {
          Swal.fire(
            'Error',
            'Para cancelar el turno es necesario que dejes un comentario',
            'warning'
          );
        }
      }
    });
  }

  rejectAppointment(appointment: Appointment) {
    Swal.fire({
      title: '¿Por qué rechazás el turno?',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Rechazar turno',
      cancelButtonText: 'No rechazar turno',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.length !== 0) {
          this.appointmentsService.rejectAppointment(appointment, result.value);
        } else {
          Swal.fire(
            'Error',
            'Para rechazar el turno es necesario que dejes un comentario',
            'warning'
          );
        }
      }
    });
  }

  acceptAppointment(appointment: Appointment) {
    this.appointmentsService.acceptAppointment(appointment);
  }

  filterBySpecialist(specialist: Specialist) {
    this.filterBy = 'Especialista: ' + specialist.firstName + ' ' + specialist.lastName;
    this.filteredAppointments = this.appointments.filter((appointment) => {
      return appointment.specialist.mail === specialist.mail;
    });
  }

  filterBySpecialty(especialidad: Specialty) {
    this.filterBy = 'Especialidad: ' + especialidad.name;
    this.filteredAppointments = this.appointments.filter((appointment) => {
      return appointment.specialty.name === especialidad.name;
    });
  }

  filterByPatient(paciente: Patient) {
    this.filterBy = 'Paciente: ' + paciente.firstName + ' ' + paciente.lastName;
    this.filteredAppointments = this.appointments.filter((appointment) => {
      return appointment.patient.firstName === paciente.firstName;
    });
  }

  async filtrarPorAltura($event: any) {
    this.filterBy = 'Altura: ' + $event.target.value;
    this.filteredAppointments = [];
    this.appointments.forEach(async (appointment) => {
      let medicalRecord = await this.appointmentsService.getMedicalRecordByID(appointment.medicalRecordID);
      if (medicalRecord.height.toString() === $event.target.value)
        this.filteredAppointments.push(appointment);
    });
  }

  async filtrarPorValor($event: any) {
    this.filteredAppointments = [];
    this.appointments.forEach(async (appointment) => {
      let medicalRecord = await this.appointmentsService.getMedicalRecordByID(appointment.medicalRecordID);
      if (
        appointment.other.key === $event.target.value ||
        appointment.other.value === $event.target.value ||
        medicalRecord.pressure.toString() === $event.target.value ||
        medicalRecord.temperature.toString() === $event.target.value ||
        medicalRecord.weight.toString() === $event.target.value ||
        medicalRecord.height.toString() === $event.target.value
      )
        this.filteredAppointments.push(appointment);
    });
  }
}