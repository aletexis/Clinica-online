import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './components/extras/not-found/not-found.component';

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

import { DashboardSpecialistComponent } from './components/dashboards/dashboard-specialist/dashboard-specialist.component';

import { DashboardPatientComponent } from './components/dashboards/dashboard-patient/dashboard-patient.component';
import { SolicitarTurnoComponent } from './components/appointments/solicitar-turno/solicitar-turno.component';

import { MyProfileComponent } from './components/users/my-profile/my-profile.component';
import { MyAppointmentsComponent } from './components/appointments/my-appointments/my-appointments.component';
import { VerHistoriasComponent } from './components/medical-records/ver-historias/ver-historias.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-patient', component: RegisterPatientComponent },
  { path: 'register-specialist', component: RegisterSpecialistComponent },
  { path: 'email-validation', component: EmailValidationComponent, data: { animation: 'AboutPage' },},

  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'dashboard-admin/my-profile', component: MyProfileComponent },
  { path: 'dashboard-admin/statistics', component: StatisticsComponent },
  { path: 'dashboard-admin/appointments', component: MyAppointmentsComponent },
  { path: 'dashboard-admin/users', component: DashboardUserComponent },
  { path: 'dashboard-admin/users/view-users', component: UserListComponent },
  { path: 'dashboard-admin/users/view-medical-records', component: VerHistoriasComponent },
  { path: 'dashboard-admin/users/enable-specialists', component: UserAdmissionComponent },
  { path: 'dashboard-admin/users/create-admin', component: CrearAdminComponent },
  { path: 'dashboard-admin/users/create-specialist', component: CrearEspecialistaComponent },
  { path: 'dashboard-admin/users/create-patient', component: CrearPacienteComponent },

  { path: 'dashboard-specialist', component: DashboardSpecialistComponent },
  { path: 'dashboard-specialist/my-profile', component: MyProfileComponent },
  { path: 'dashboard-specialist/my-patients', component: VerHistoriasComponent },
  { path: 'dashboard-specialist/my-appointments', component: MyAppointmentsComponent },

  { path: 'dashboard-patient', component: DashboardPatientComponent },
  { path: 'dashboard-patient/my-profile', component: MyProfileComponent },
  { path: 'dashboard-patient/my-appointments', component: MyAppointmentsComponent },
  { path: 'dashboard-patient/request-appointment', component: SolicitarTurnoComponent },

  {
    path: '**',
    component: NotFoundComponent,
    data: { animation: 'HomePage' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
