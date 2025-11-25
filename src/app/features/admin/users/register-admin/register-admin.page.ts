import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Captcha } from '../../../auth/register/captcha/captcha';

@Component({
  selector: 'app-register-admin.page',
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
  templateUrl: './register-admin.page.html',
  styleUrl: './register-admin.page.scss'
})
export class RegisterAdminPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private loadingService = inject(LoadingService);

  isLinear = true;
  private captchaValidated = false;

  personalForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50), onlyLettersValidator]],
    lastName: ['', [Validators.required, Validators.maxLength(50), onlyLettersValidator]],
    age: ['', [Validators.required, validAgeValidator]],
    dni: ['', [Validators.required, dniValidator]],
  });

  credentialsForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(50), basicEmailValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profileImg: ['', Validators.required],
    profileImg2: ['', Validators.required],
  });

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

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    const control = this.credentialsForm.get(controlName);

    if (!file) {
      control?.setErrors({ required: true });
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      control?.setErrors({ invalidType: true });
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      control?.setErrors({ maxSizeExceeded: true });
      event.target.value = '';
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

    const { firstName, lastName, dni, age } = this.personalForm.value;
    const { email, password, profileImg } = this.credentialsForm.value;

    try {
      const profileImgBase64 = await this.toBase64(profileImg);

      await this.authService.register(email, password, 'admin', {
        firstName,
        lastName,
        dni,
        age,
        role: 'admin',
        profileImgs: [profileImgBase64],
        approved: true,
        emailVerified: true,
        createdAt: new Date()
      }, true);

      await this.authService.sendPasswordReset(email);

      this.alertService.success('Registro exitoso');
      this.router.navigateByUrl('/admin/usuarios');
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
  return age >= 18 && age <= 100 ? null : { invalidAge: true };
};

export const dniValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  const cleanValue = value.replace(/[\.\-]/g, '');
  return /^\d{8}$/.test(cleanValue) ? null : { invalidDni: true };
};

export const basicEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { invalidEmail: true };
};