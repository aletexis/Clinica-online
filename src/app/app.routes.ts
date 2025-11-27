import { Routes } from '@angular/router';
import { WelcomePage } from './features/common/welcome/welcome.page';
import { publicGuard } from './core/guards/public.guard';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
	{ path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
	{ path: 'bienvenida', component: WelcomePage },

	// Auth
	{
		path: 'inicio-sesion',
		canActivate: [publicGuard],
		loadComponent: () =>
			import('./features/auth/login/login.page').then(m => m.LoginPage),
	},
	{
		path: 'registro',
		canActivate: [publicGuard],
		loadComponent: () =>
			import('./features/auth/register/register.page').then(m => m.RegisterPage),
	},
	{
		path: 'registro-especialista',
		canActivate: [publicGuard],
		loadComponent: () =>
			import('./features/auth/register/register-specialist/register-specialist.page').then(m => m.RegisterSpecialistPage),
	},
	{
		path: 'registro-paciente',
		canActivate: [publicGuard],
		loadComponent: () =>
			import('./features/auth/register/register-patient/register-patient.page').then(m => m.RegisterPatientPage),
	},

	// Admin
	{
		path: 'dashboard/admin',
		canActivate: [authGuard, adminGuard],
		loadComponent: () =>
			import('./features/admin/dashboard/dashboard-admin.page').then(m => m.DashboardAdminPage),
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/admin/menu/admin-menu.component').then(m => m.AdminMenuComponent),
			},
			{
				path: 'mi-perfil',
				loadComponent: () =>
					import('./features/common/my-profile/my-profile.page').then(m => m.MyProfilePage),
			},
			{
				path: 'estadisticas',
				loadComponent: () =>
					import('./features/admin/statistics/statistics.page').then(m => m.StatisticsPage),
			},
			{
				path: 'usuarios',
				loadComponent: () =>
					import('./features/admin/users/dashboard-user/dashboard-user.page').then(m => m.DashboardUserPage),
				children: [
					{ path: '', loadComponent: () => import('./features/admin/users/user-menu/user-menu.component').then(m => m.UserMenuComponent) },

					{
						path: 'listado',
						loadComponent: () =>
							import('./features/admin/users/user-list/user-list.page').then(m => m.UserListPage),
					},
					{
						path: 'aprobacion',
						loadComponent: () =>
							import('./features/admin/users/user-approval/user-approval.page').then(m => m.UserApprovalPage),
					},
					{
						path: 'registro-paciente',
						loadComponent: () =>
							import('./features/auth/register/register-patient/register-patient.page').then(m => m.RegisterPatientPage),
					},
					{
						path: 'registro-especialista',
						loadComponent: () =>
							import('./features/auth/register/register-specialist/register-specialist.page').then(m => m.RegisterSpecialistPage),
					},
					{
						path: 'registro-administrador',
						loadComponent: () =>
							import('./features/admin/users/register-admin/register-admin.page').then(m => m.RegisterAdminPage),
					},
				],
			},
			{
				path: 'turnos',
				loadComponent: () =>
					import('./features/admin/appointments/dashboard-appointment/dashboard-appointment.page').then(m => m.DashboardAppointmentPage),
				children: [
					{ path: '', loadComponent: () => import('./features/admin/appointments/appointment-menu/appointment-menu.component').then(m => m.AppointmentMenuComponent) },
					{
						path: 'listado',
						loadComponent: () =>
							import('./features/common/appointments/appointment-list/appointment-list.page').then(m => m.AppointmentListPage),
					},
					{
						path: 'crear',
						loadComponent: () =>
							import('./features/common/appointments/create-appointment/create-appointment.page').then(m => m.CreateAppointmentPage),
					},
				],
			},
		],
	},

	// Specialist
	{
		path: 'dashboard/especialista',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/specialist/dashboard/dashboard-specialist.page').then(m => m.DashboardSpecialistPage),
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/specialist/menu/specialist-menu.component').then(m => m.SpecialistMenuComponent),
			},
			{
				path: 'mi-perfil',
				loadComponent: () =>
					import('./features/common/my-profile/my-profile.page').then(m => m.MyProfilePage),
			},
			{
				path: 'turnos/listado',
				loadComponent: () =>
					import('./features/common/appointments/appointment-list/appointment-list.page').then(m => m.AppointmentListPage),
			},
		],
	},

	// Patient
	{
		path: 'dashboard/paciente',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/patient/dashboard/dashboard-patient.page').then(m => m.DashboardPatientPage),
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/patient/menu/patient-menu.component').then(m => m.PatientMenuComponent),
			},
			{
				path: 'mi-perfil',
				loadComponent: () =>
					import('./features/common/my-profile/my-profile.page').then(m => m.MyProfilePage),
			},
			{
				path: 'turnos/crear',
				loadComponent: () =>
					import('./features/common/appointments/create-appointment/create-appointment.page').then(m => m.CreateAppointmentPage),
			},
			{
				path: 'turnos/listado',
				loadComponent: () =>
					import('./features/common/appointments/appointment-list/appointment-list.page').then(m => m.AppointmentListPage),
			},
		],
	},
];
// {
// 	path: '**',
// 	loadComponent: () =>
// 		import('./features/not-found/not-found.page').then(m => m.NotFoundPage)
// },