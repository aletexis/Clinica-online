import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Captcha } from '../captcha/captcha';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { getDocs, collection } from '@angular/fire/firestore';


@Component({
  selector: 'app-register-specialist',
  imports: [
    CommonModule,
    RouterModule,
    MatStepperModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './register-specialist.page.html',
  styleUrl: './register-specialist.page.scss'
})
export class RegisterSpecialistPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private firestore = inject(FirestoreService);
  private loadingService = inject(LoadingService);

  isLinear = true;
  private captchaValidated = false;
  existingSpecialties: Specialty[] = [];
  selectedExistingSpecialties: Specialty[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private isAdminCreating = false;


  @ViewChild('specialtyInput') specialtyInput!: ElementRef<HTMLInputElement>;

  personalForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50), onlyLettersValidator]],
    lastName: ['', [Validators.required, Validators.maxLength(50), onlyLettersValidator]],
    age: ['', [Validators.required, validAgeValidator]],
    dni: ['', [Validators.required, dniValidator]],
    specialties: [[], [Validators.maxLength(80), maxSpecialtyLengthValidator(80)]]
  }, {
    validators: [atLeastOneSpecialtyValidator(() => this.selectedExistingSpecialties)],
  });

  credentialsForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(50), basicEmailValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profileImg: ['', Validators.required],
  });

  ngOnInit(): void {
    this.firestore.getAll<Specialty>('specialties').subscribe({
      next: (data) => (this.existingSpecialties = data),
      error: (err) => console.error('Error cargando especialidades', err),
    });

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

  onSelectExistingSpecialties(event: MatSelectChange): void {
    const selectedIds = event.value;
    this.selectedExistingSpecialties = this.existingSpecialties.filter(spec =>
      selectedIds.includes(spec.uid)
    );
    this.personalForm.updateValueAndValidity();
  }

  addSpecialty(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const ctrl = this.personalForm.get('specialties');

    if (value) {
      if (value.length > 80) {
        ctrl?.setErrors({ maxLengthExceeded: true });
      } else if (!this.manualSpecialties.includes(value)) {
        this.manualSpecialties.push(value);
        ctrl?.setValue(this.manualSpecialties);
      }
    }
    event.chipInput!.clear();
  }

  removeSpecialty(specialty: string): void {
    const index = this.manualSpecialties.indexOf(specialty);
    if (index >= 0) {
      this.manualSpecialties.splice(index, 1);
      this.personalForm.get('specialties')?.setValue(this.manualSpecialties);
    }
  }

  get manualSpecialties(): string[] {
    return this.personalForm.get('specialties')?.value || [];
  }

  private hasPendingSpecialty(): boolean {
    const value = this.specialtyInput?.nativeElement?.value?.trim();
    return !!value;
  }

  private getAllSelectedSpecialties(): Specialty[] {
    const fromDb = this.selectedExistingSpecialties.map(s => ({
      name: s.name,
      image: s.image || '/images/specialties/default.svg'
    }));
    const manual = this.manualSpecialties.map(name => ({
      name,
      image: '/images/specialties/default.svg'
    }));
    return [...fromDb, ...manual];
  }

  private async getAllSpecialtyUids(allSelected: Specialty[]): Promise<string[]> {
    const specialtiesCollection = collection(this.firestore.firestore, 'specialties');
    const snapshot = await getDocs(specialtiesCollection);
    const currentSpecialties = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...(doc.data() as Specialty)
    }));

    const normalize = (name: string) =>
      (name || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const uids: string[] = [];

    for (const spec of allSelected) {
      const specName = spec.name?.trim();
      if (!specName) continue;

      const existing = currentSpecialties.find(
        s => normalize(s.name) === normalize(specName)
      );

      if (existing) {
        uids.push(existing.uid);
      } else {
        const docRef = await this.firestore.create<Specialty>('specialties', {
          name: specName,
          image: spec.image || '/images/specialties/default.svg'
        });
        uids.push(docRef.id);
      }
    }

    return Array.from(new Set(uids));
  }

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

  nextStep(stepper: MatStepper) {
    if (this.hasPendingSpecialty()) {
      this.alertService.info('Presioná Enter para agregar la especialidad antes de continuar.');
      this.personalForm.get('specialties')?.markAsTouched();
      return;
    }

    if (this.personalForm.invalid) {
      this.alertService.error('Por favor, completá todos los campos correctamente');
      this.personalForm.markAllAsTouched();
      return;
    }

    stepper.next();
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
      const profileBase64 = await this.toBase64(profileImg);
      const allSpecialties = this.getAllSelectedSpecialties();
      const specialtyUids = await this.getAllSpecialtyUids(allSpecialties);

      const approved = this.isAdminCreating ? true : false;
      const emailVerified = this.isAdminCreating ? true : false;

      await this.authService.register(email, password, 'specialist', {
        firstName,
        lastName,
        dni,
        age,
        role: 'specialist',
        approved,
        emailVerified,
        profileImgs: [profileBase64],
        specialties: specialtyUids,
        createdAt: new Date()
      }, this.isAdminCreating);

      if (this.isAdminCreating) {
        await this.authService.sendPasswordReset(email);
        this.alertService.info('Se envió un correo para que el especialista cambie su contraseña.');
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
    this.router.navigateByUrl('registro-paciente');
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
  return age >= 18 && age <= 80 ? null : { invalidAge: true };
};

export const dniValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  const cleanValue = value.replace(/[\.\-]/g, '');
  return /^\d{8}$/.test(cleanValue) ? null : { invalidDni: true };
};

export const maxSpecialtyLengthValidator = (max: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const specialties: string[] = control.value || [];
    if (!specialties.length) return null;
    const invalid = specialties.some(s => s.length > max);
    return invalid ? { maxLengthExceeded: true } : null;
  };
};

export const basicEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { invalidEmail: true };
};

export const atLeastOneSpecialtyValidator = (getExistingFn: () => any[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const manual = control.get('specialties')?.value || [];
    const existing = getExistingFn() || [];

    const hasAny = (manual.length > 0) || (existing.length > 0);
    return hasAny ? null : { noSpecialtySelected: true };
  };
};