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
import { AuthService } from '../../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

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
    StatusBadgeDirective,
    MatIconModule
  ],
  templateUrl: './appointment-list.page.html',
  styleUrl: './appointment-list.page.scss'
})
export class AppointmentListPage {

  role: 'admin' | 'specialist' | 'patient' | null = null;

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];

  specialistsList: { uid: string; name: string }[] = [];
  patientsList: { uid: string; name: string }[] = [];
  specialtiesList: string[] = [];

  searchTerm: string = '';

  maxCommentLength: number = 250;

  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;
  selectedAppointment!: Appointment;

  @ViewChild('cancelDialog') cancelDialog!: TemplateRef<any>;
  cancelComment: string = '';

  @ViewChild('rejectDialog') rejectDialog!: TemplateRef<any>;
  rejectComment: string = '';

  @ViewChild('acceptDialog') acceptDialog!: TemplateRef<any>;

  @ViewChild('completeDialog') completeDialog!: TemplateRef<any>;
  completeComment: string = '';
  completeDiagnosis: string = '';

  @ViewChild('reviewDialog') reviewDialog!: TemplateRef<any>;

  @ViewChild('surveyDialog') surveyDialog!: TemplateRef<any>;

  @ViewChild('ratingDialog') ratingDialog!: TemplateRef<any>;
  patientRatingComment: string = '';


  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    combineLatest([this.authService.userInitialized$, this.authService.user$])
      .subscribe(([initialized, user]) => {
        if (!initialized || !user) return;

        this.role = user.role;
        this.loadAppointmentsForRole();
      });
  }

  // Carga de turnos

  loadAppointmentsForRole() {
    if (this.role === 'patient') this.loadPatientAppointments();
    else if (this.role === 'specialist') this.loadSpecialistAppointments();
    else this.loadAdminAppointments();
  }

  loadAdminAppointments() {
    this.loadingService.startLoading();

    const specialists$ = this.firestoreService.getFiltered<any>('users', 'role', 'specialist');
    const patients$ = this.firestoreService.getFiltered<any>('users', 'role', 'patient');
    const appointments$ = this.firestoreService.getAll<Appointment>('appointments');

    combineLatest([specialists$, patients$, appointments$])
      .pipe(take(1))
      .subscribe({
        next: ([specialists, patients, apps]) => {
          this.specialistsList = specialists.map(s => ({
            uid: s.uid,
            name: `${s.firstName} ${s.lastName}`
          }));
          this.patientsList = patients.map(p => ({
            uid: p.uid,
            name: `${p.firstName} ${p.lastName}`
          }));

          this.appointments = apps;
          this.filteredAppointments = [...apps];
          this.specialtiesList = Array.from(new Set(apps.map(a => a.specialty)));

          this.loadingService.stopLoading();
        },
        error: () => {
          this.alertService.error('Error al cargar turnos');
          this.loadingService.stopLoading();
        }
      });
  }

  loadSpecialistAppointments() {
    const uid = this.authService.userSubject.value!.uid;

    this.loadingService.startLoading();

    const patients$ = this.firestoreService.getFiltered<any>('users', 'role', 'patient');
    const appointments$ = this.firestoreService.getFiltered<Appointment>('appointments', 'specialistUid', uid);

    combineLatest([patients$, appointments$])
      .pipe(take(1))
      .subscribe({
        next: ([patients, apps]) => {

          this.patientsList = patients.map(p => ({
            uid: p.uid,
            name: `${p.firstName} ${p.lastName}`
          }));

          this.appointments = apps;
          this.filteredAppointments = [...apps];

          this.loadingService.stopLoading();
        },
        error: () => {
          this.alertService.error('Error al cargar turnos');
          this.loadingService.stopLoading();
        }
      });
  }

  loadPatientAppointments() {
    const uid = this.authService.userSubject.value!.uid;

    this.loadingService.startLoading();

    const specialists$ = this.firestoreService.getFiltered<any>('users', 'role', 'specialist');
    const appointments$ = this.firestoreService.getFiltered<Appointment>('appointments', 'patientUid', uid);

    combineLatest([specialists$, appointments$])
      .pipe(take(1))
      .subscribe({
        next: ([specialists, apps]) => {

          this.specialistsList = specialists.map(s => ({
            uid: s.uid,
            name: `${s.firstName} ${s.lastName}`
          }));

          this.appointments = apps;
          this.filteredAppointments = [...apps];

          this.loadingService.stopLoading();
        },
        error: () => {
          this.alertService.error('Error al cargar turnos');
          this.loadingService.stopLoading();
        }
      });
  }

  // Filtro de busqueda

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = value;

    if (!value.trim()) {
      this.filteredAppointments = [...this.appointments];
      return;
    }

    this.filteredAppointments = this.appointments.filter(app => {
      const specialty = app.specialty?.toLowerCase() || '';
      const specialistName = this.getSpecialistName(app.specialistUid)?.toLowerCase() || '';
      const patientName = this.getPatientName(app.patientUid)?.toLowerCase() || '';

      switch (this.role) {

        case 'admin':
        case 'patient':
          return (
            specialty.includes(value) ||
            specialistName.includes(value)
          );

        case 'specialist':
          return (
            specialty.includes(value) ||
            patientName.includes(value)
          );

        default:
          return false;
      }
    });
  }

  get searchPlaceholder(): string {
    if (this.role === 'patient') {
      return 'Buscar por especialidad o especialista...';
    }
    if (this.role === 'specialist') {
      return 'Buscar por especialidad o paciente...';
    }
    return 'Buscar por especialidad o especialista...';
  }

  getPatientName(uid: string): string {
    return this.patientsList.find(p => p.uid === uid)?.name || '';
  }

  getSpecialistName(uid: string): string {
    return this.specialistsList.find(s => s.uid === uid)?.name || '';
  }

  // Definicion de acciones

  getActions(app: Appointment): string[] {
    const actions: string[] = [];

    actions.push('ver-detalle');

    if (this.role === 'admin') {
      return [...actions, ...this.getAdminActions(app)];
    }

    if (this.role === 'specialist') {
      return [...actions, ...this.getSpecialistActions(app)];
    }

    if (this.role === 'patient') {
      return [...actions, ...this.getPatientActions(app)];
    }

    return actions;
  }

  getAdminActions(app: Appointment): string[] {
    const actions = [];

    if (!['accepted', 'completed', 'rejected', 'cancelled'].includes(app.status)) {
      actions.push('cancelar');
    }

    return actions;
  }

  getSpecialistActions(app: Appointment): string[] {
    const actions: string[] = [];

    if (app.status === 'pending') {
      actions.push('aceptar', 'rechazar');
    }

    if (app.status === 'accepted') {
      actions.push('finalizar');
    }

    if (!['accepted', 'completed', 'rejected', 'cancelled'].includes(app.status)) {
      actions.push('cancelar');
    }

    if (app.patientRatingComment) {
      actions.push('ver-resena');
    }

    return actions;
  }

  getPatientActions(app: Appointment): string[] {
    const actions: string[] = [];

    if (!['completed', 'cancelled', 'rejected'].includes(app.status)) {
      actions.push('cancelar');
    }

    if (app.status === 'completed') {
      if (app.specialistReview && !app.patientSurvey) {
        actions.push('encuesta');
      }

      if (!app.patientRatingComment) {
        actions.push('calificar');
      }

      if (app.specialistReview) {
        actions.push('ver-resena');
      }
    }

    return actions;
  }


  // Dialogs

  // Todos
  get isCommentTooLong() {
    return this.cancelComment.length >= this.maxCommentLength;
  }

  openDetailDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.dialog.open(this.detailDialog, { width: '500px' });
  }

  openCancelDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.cancelComment = '';
    this.dialog.open(this.cancelDialog, { width: '500px' });
  }

  cancelAppointment() {
    if (!this.role || !this.selectedAppointment) return;

    if (this.selectedAppointment.status === 'cancelled') {
      this.alertService.error('El turno ya está cancelado');
      return;
    }

    const map: Record<string, string> = {
      admin: 'adminCancellationComment',
      patient: 'patientCancellationComment',
      specialist: 'specialistCancellationComment'
    };

    const updated: any = {
      status: 'cancelled',
      [map[this.role]]: this.cancelComment
    };

    this.firestoreService.update('appointments', this.selectedAppointment.id!, updated)
      .then(() => {
        this.alertService.success('Turno cancelado con éxito');
        this.dialog.closeAll();
        this.loadAppointmentsForRole();
      })
      .catch(() => this.alertService.error('Hubo un problema al cancelar turno'));
  }

  // Especialista

  openRejectDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.rejectComment = '';
    this.dialog.open(this.rejectDialog, { width: '500px' });
  }

  rejectAppointment() {
    if (!this.selectedAppointment) return;

    if (this.selectedAppointment.status !== 'pending') {
      this.alertService.error('Este turno ya no puede ser rechazado');
      return;
    }

    if (!this.rejectComment.trim()) {
      this.alertService.error('Debe ingresar un motivo');
      return;
    }

    const updated = {
      status: 'rejected',
      specialistRejectionComment: this.rejectComment
    };

    this.firestoreService.update('appointments', this.selectedAppointment.id!, updated)
      .then(() => {
        this.alertService.success('Turno rechazado con éxito');
        this.dialog.closeAll();
        this.loadAppointmentsForRole();
      })
      .catch(() => {
        this.alertService.error('Hubo un problema al rechazar turno');
      });
  }

  openAcceptDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.dialog.open(this.acceptDialog, { width: '500px' });
  }

  acceptAppointment() {
    if (!this.selectedAppointment) return;

    const validStatuses = ['pending'];
    if (!validStatuses.includes(this.selectedAppointment.status)) {
      this.alertService.error('Este turno ya no puede ser aceptado.');
      return;
    }

    const updated = {
      status: 'accepted'
    };

    this.firestoreService.update('appointments', this.selectedAppointment.id!, updated)
      .then(() => {
        this.alertService.success('Turno aceptado con éxito');
        this.dialog.closeAll();
        this.loadAppointmentsForRole();
      })
      .catch(() => {
        this.alertService.error('Hubo un problema al aceptar el turno');
      });
  }

  openCompleteDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.completeComment = '';
    this.completeDiagnosis = '';
    this.dialog.open(this.completeDialog, { width: '500px' });
  }

  completeAppointment() {
    if (!this.selectedAppointment) return;

    if (this.selectedAppointment.status !== 'accepted') {
      this.alertService.error('Solo podés finalizar turnos aceptados');
      return;
    }

    const review = this.completeComment.trim();
    const diagnosis = this.completeDiagnosis.trim();

    if (!review || !diagnosis) {
      this.alertService.error('Debés completar comentario y diagnóstico');
      return;
    }

    if (review.length > this.maxCommentLength || diagnosis.length > this.maxCommentLength) {
      this.alertService.error('Uno de los campos supera el límite permitido');
      return;
    }

    const updated: any = {
      status: 'completed',
      specialistReview: {
        comment: review,
        diagnosis: diagnosis,
      }
    };

    this.firestoreService.update('appointments', this.selectedAppointment.id!, updated)
      .then(() => {
        this.alertService.success('Turno finalizado con éxito');
        this.dialog.closeAll();
        this.loadAppointmentsForRole();
      })
      .catch(() => {
        this.alertService.error('Hubo un problema al finalizar el turno');
      });
  }

  // Especialista y Paciente

  openReviewDialog(app: Appointment) {
    console.log(app)
    this.selectedAppointment = app;
    this.dialog.open(this.reviewDialog, { width: '500px' });
  }

  // Paciente

  openSurveyDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.dialog.open(this.surveyDialog, { width: '500px' });
  }

  submitSurvey() {
    console.log();
  }

  openRatingDialog(app: Appointment) {
    this.selectedAppointment = app;
    this.patientRatingComment = '';
    this.dialog.open(this.ratingDialog, { width: '500px' });
  }

  submitPatientReview() {
    const updated = {
      patientRatingComment: this.patientRatingComment.trim()
    };

    this.firestoreService.update('appointments', this.selectedAppointment.id!, updated)
      .then(() => {
        this.alertService.success('Comentario enviado con éxito');
        this.dialog.closeAll();
        this.loadAppointmentsForRole();
      })
      .catch(() => this.alertService.error('Hubo un problema al enviar comentario'));
  }
}