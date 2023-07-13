import { UtilsModule } from './components/utils/utils.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import {
  RECAPTCHA_SETTINGS,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';

import { NewMedicalRecordComponent } from './components/medical-records/new-medical-record/new-medical-record.component';
import { MiHistoriaComponent } from './components/medical-records/mi-historia/mi-historia.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';

import { DniPipe } from './pipes/dni.pipe';
import { TempPipe } from './pipes/temp.pipe';
import { AlturaPipe } from './pipes/altura.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { AgrandarDirective } from './directives/agrandar.directive';
import { BorderDirective } from './directives/border.directive';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';



import { CaptchaComponent } from './components/extras/captcha/captcha.component';
import { FastLoginComponent } from './components/extras/fast-login/fast-login.component';
import { NavbarComponent } from './components/extras/navbar/navbar.component';
import { SpinnerComponent } from './components/extras/spinner/spinner.component';

import { WelcomeComponent } from './components/extras/welcome/welcome.component';
import { LoginComponent } from './components/forms/login/login.component';
import { RegisterComponent } from './components/extras/register/register.component';
import { RegisterPatientComponent } from './components/forms/register-patient/register-patient.component';
import { RegisterSpecialistComponent } from './components/forms/register-specialist/register-specialist.component';
import { EmailValidationComponent } from './components/extras/email-validation/email-validation.component';

import { DashboardAdminComponent } from './components/dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './components/dashboards/dashboard-user/dashboard-user.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserAdmissionComponent } from './components/users/user-admission/user-admission.component';
import { CrearAdminComponent } from './components/users/crear-admin/crear-admin.component';
import { CrearEspecialistaComponent } from './components/users/crear-especialista/crear-especialista.component';
import { CrearPacienteComponent } from './components/users/crear-paciente/crear-paciente.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

import { AppointmentsPerDayComponent } from './components/statistics/appointments-per-day/appointments-per-day.component';
import { AppointmentsBySpecialtyComponent } from './components/statistics/appointments-by-specialty/appointments-by-specialty.component';
import { LoginHistoryComponent } from './components/statistics/login-history/login-history.component';
import { AppointmentsRequestedBySpecialistComponent } from './components/statistics/appointments-requested-by-specialist/appointments-requested-by-specialist.component';
import { CompletedAppointmentsComponent } from './components/statistics/completed-appointments/completed-appointments.component';

import { DashboardSpecialistComponent } from './components/dashboards/dashboard-specialist/dashboard-specialist.component';

import { DashboardPatientComponent } from './components/dashboards/dashboard-patient/dashboard-patient.component';
import { SolicitarTurnoComponent } from './components/appointments/solicitar-turno/solicitar-turno.component';

import { MyProfileComponent } from './components/users/my-profile/my-profile.component';
import { MyAppointmentsComponent } from './components/appointments/my-appointments/my-appointments.component';
import { VerHistoriasComponent } from './components/medical-records/ver-historias/ver-historias.component';
import { NotFoundComponent } from './components/extras/not-found/not-found.component';
import { SpecialtiesPipe } from './pipes/specialties.pipe';

@NgModule({
  declarations: [
    AppComponent,

    MyAppointmentsComponent,
    SolicitarTurnoComponent,

    DashboardSpecialistComponent,
    DashboardPatientComponent,
    DashboardAdminComponent,
    DashboardUserComponent,

    CaptchaComponent,
    FastLoginComponent,
    NavbarComponent,
    RegisterComponent,
    SpinnerComponent,
    WelcomeComponent,

    LoginComponent,
    RegisterPatientComponent,
    RegisterSpecialistComponent,

    NewMedicalRecordComponent,
    MiHistoriaComponent,
    VerHistoriasComponent,

    AppointmentsBySpecialtyComponent,
    AppointmentsPerDayComponent,
    AppointmentsRequestedBySpecialistComponent,
    CompletedAppointmentsComponent,
    LoginHistoryComponent,
    StatisticsComponent,

    CrearAdminComponent,
    CrearEspecialistaComponent,
    CrearPacienteComponent,
    MyProfileComponent,
    UserAdmissionComponent,
    UserListComponent,

    DniPipe,
    TempPipe,
    AlturaPipe,
    SpecialtiesPipe,
    HighlightDirective,
    AgrandarDirective,
    BorderDirective,
    NotFoundComponent,
  ],
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,



    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaModule,

    BrowserAnimationsModule,
    UtilsModule,

    SweetAlert2Module.forRoot(),
    NgChartsModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFirebaseApp(() => initializeApp(environment.firebase, 'Secondary')),
  ],
  exports: [],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
