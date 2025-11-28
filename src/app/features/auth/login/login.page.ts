import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom, take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  private firestoreService = inject(FirestoreService);
  private destroyRef = inject(DestroyRef);
  authReady = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, basicEmailValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  quickUsers: any[] = [];

  private roleRouteMap: Record<string, string> = {
    admin: 'admin',
    specialist: 'especialista',
    patient: 'paciente'
  };

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(() => {
      this.authReady = true;
      this.loadQuickAccessUsers();
    });
  }

  loadQuickAccessUsers() {
    this.firestoreService
      .getFiltered('users', 'isQuickAccess', true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.quickUsers = users ?? [];
      });
  }

  autoFillFields(email: string, password: string) {
    this.loginForm.patchValue({ email, password: 123456 });
  }

  getBorderColor(role: string) {
    switch (role) {
      case 'admin': return '#737F85';
      case 'specialist': return '#EE7734';
      case 'patient': return '#415464';
      default: return '#254E70';
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.alertService.warning('Completá todos los campos');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loadingService.startLoading();

    const startTime = Date.now();
    let alertToShow: { type: 'success' | 'error' | 'warning' | 'info', msg: string } | null = null;

    try {
      const result = await firstValueFrom(this.authService.login(email, password));
      const firebaseUser = result.user;

      if (!firebaseUser) {
        alertToShow = { type: 'error', msg: 'Credenciales inválidas' };
        return;
      }

      if (!firebaseUser.emailVerified) {
        alertToShow = { type: 'warning', msg: 'Verificá tu correo antes de iniciar sesión' };
        return;
      }

      const userData = await this.authService.getUserData(firebaseUser.uid);
      if (!userData) {
        alertToShow = { type: 'error', msg: 'Usuario no encontrado' };
        return;
      }

      if (userData.role === 'specialist' && !userData.approved) {
        alertToShow = { type: 'warning', msg: 'Tu cuenta debe ser aprobada por un administrador' };
        return;
      }

      alertToShow = { type: 'success', msg: 'Bienvenido/a' };
      const targetRoute = this.roleRouteMap[userData.role];

      await new Promise(r => setTimeout(r, 500));
      this.router.navigateByUrl(`/dashboard/${targetRoute}`);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        alertToShow = { type: 'info', msg: 'Usuario no registrado. Registrate para continuar.' };
      } else if (err.code === 'auth/wrong-password') {
        alertToShow = { type: 'error', msg: 'Credenciales inválidas' };
      } else {
        alertToShow = { type: 'error', msg: 'Hubo un problema al iniciar sesión' };
      }
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsed);
      await new Promise(r => setTimeout(r, delay));

      this.loadingService.stopLoading();

      if (alertToShow) {
        this.alertService[alertToShow.type](alertToShow.msg, 4000);
      }
    }
  }
}

export const basicEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { invalidEmail: true };
};