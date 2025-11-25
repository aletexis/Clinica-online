import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../../../core/services/alert.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Captcha } from '../captcha/captcha';


@Component({
  selector: 'app-register-patient',
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
  ],
  templateUrl: './register-patient.page.html',
  styleUrl: './register-patient.page.scss'
})
export class RegisterPatientPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private loadingService = inject(LoadingService);

  isLinear = true;
  private captchaValidated = false;
  private isAdminCreating = false;

  personalForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50), onlyLettersValidator]],
    lastName: ['', [Validators.required, Validators.maxLength(50), onlyLettersValidator]],
    age: ['', [Validators.required, validAgeValidator]],
    dni: ['', [Validators.required, dniValidator]],
    healthcareProvider: ['', [Validators.required, Validators.maxLength(100), healthcareProviderValidator]],
  });

  credentialsForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(50), basicEmailValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profileImg: ['', Validators.required],
    profileImg2: ['', Validators.required],
  });

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isAdminCreating = !!user && user.role === 'admin';
    });
  }

  constructorEffect = effect(() => {
    const dniControl = this.personalForm.get('dni');
    if (!dniControl) return;

    dniControl.valueChanges.subscribe((value: string) => {
      if (!value) return;
      const cleaned = value.replace(/[\.\-]/g, '');
      if (cleaned !== value) {
        dniControl.setValue(cleaned, { emitEvent: false });
      }
    });
  });

  onFileChange(event: any, controlName: 'profileImg' | 'profileImg2') {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      this.alertService.error('Solo se permiten imágenes PNG, JPG o JPEG.');
      event.target.value = '';
      this.credentialsForm.get(controlName)?.reset();
      return;
    }

    if (file.size > maxSize) {
      this.alertService.error('La imagen no debe superar los 2MB.');
      event.target.value = '';
      this.credentialsForm.get(controlName)?.reset();
      return;
    }

    this.credentialsForm.patchValue({ [controlName]: file });
  }

  private async toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  submit() {
    if (this.personalForm.invalid || this.credentialsForm.invalid) {
      this.alertService.error('Por favor, completá todos los campos correctamente');
      this.personalForm.markAllAsTouched();
      this.credentialsForm.markAllAsTouched();
      return;
    }

    this.openCaptchaModal();
  }

  openCaptchaModal() {
    const dialogRef = this.dialog.open(Captcha, {
      width: '500px',
      disableClose: false,
      panelClass: 'captcha-dialog-centered'
    });

    dialogRef.afterClosed().subscribe((captchaCode: string | undefined) => {
      if (captchaCode) {
        this.captchaValidated = true;
        this.finishRegistration();
      } else {
        this.alertService.error('Completá el captcha para continuar');
      }
    });
  }

  private async finishRegistration() {
    if (!this.captchaValidated) {
      this.alertService.error('Por favor, completá el captcha para continuar');
      return;
    }

    this.loadingService.startLoading();

    const { firstName, lastName, dni, age, healthcareProvider } = this.personalForm.value;
    const { email, password, profileImg, profileImg2 } = this.credentialsForm.value;

    try {
      const profileImgBase64 = await this.toBase64(profileImg);
      const profileImg2Base64 = await this.toBase64(profileImg2);

      const approved = true;
      const emailVerified = this.isAdminCreating ? true : false;

      await this.authService.register(email, password, 'patient', {
        firstName,
        lastName,
        dni,
        age,
        healthcareProvider,
        profileImgs: [profileImgBase64, profileImg2Base64],
        approved,
        emailVerified,
        createdAt: new Date()
      }, this.isAdminCreating);

      if (this.isAdminCreating) {
        await this.authService.sendPasswordReset(email);
        this.alertService.info('Se envió un correo para que el paciente cambie su contraseña.');
      }

      this.alertService.success('Registro exitoso');

      if (this.isAdminCreating) {
        this.router.navigateByUrl('/admin/usuarios');
      } else {
        this.router.navigateByUrl('/inicio-sesion');
      }
    } catch (err: any) {
      console.error('Error al registrar usuario:', err);

      if (err.code === 'auth/email-already-in-use') {
        this.alertService.warning('Este correo electrónico ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        this.alertService.error('La contraseña es demasiado débil.');
      } else {
        this.alertService.error('Hubo un problema al registrar el usuario.');
      }
    } finally {
      this.loadingService.stopLoading();
    }
  }

  switchRole() {
    this.router.navigateByUrl("registro-especialista");
  }
}

export const onlyLettersValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value?.trim();
  if (!value) return null;
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value) ? null : { onlyLetters: true };
};

export const validAgeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') return null;
  const age = Number(value);
  return age >= 0 && age <= 80 ? null : { invalidAge: true };
};

export const dniValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  const cleanValue = value.replace(/[\.\-]/g, '');
  return /^\d{8}$/.test(cleanValue) ? null : { invalidDni: true };
};

export const healthcareProviderValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value?.trim();
  if (!value) return null;
  return /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)
    ? null
    : { invalidHealthcareProvider: true };
};

export const basicEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { invalidEmail: true };
};