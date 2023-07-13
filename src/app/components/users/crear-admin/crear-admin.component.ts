import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Admin } from 'src/app/classes/admin';
import { Specialty } from 'src/app/classes/specialty';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-admin',
  templateUrl: './crear-admin.component.html',
  styleUrls: ['./crear-admin.component.scss'],
})
export class CrearAdminComponent implements OnInit {
  // especialidades: string[] = [];
  // imagen?: File;

  // public forma!: FormGroup;

  // constructor(public fb: FormBuilder, private auth: AuthService) {}

  // ngOnInit(): void {
  //   this.forma = this.fb.group({
  //     nombre: ['', [Validators.required]],
  //     apellido: ['', [Validators.required]],
  //     edad: [
  //       '',
  //       [Validators.required, , Validators.min(18), Validators.max(99)],
  //     ],
  //     dni: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.pattern('[0-9]*'),
  //         Validators.minLength(7),
  //         Validators.maxLength(8),
  //       ],
  //     ],
  //     mail: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(8)]],
  //     'img-perfil': ['', [Validators.required]],
  //   });
  // }

  // ElegirEspecialidad($event: string[]) {
  //   this.especialidades = $event;
  // }

  // PostEspecialista() {
  //   const admin = new Admin(
  //     this.forma.value.nombre,
  //     this.forma.value.apellido,
  //     this.forma.value.edad,
  //     this.forma.value.dni,
  //     this.forma.value.mail,
  //     this.forma.value.password,
  //     ''
  //   );
  //   this.auth.createAdminFromAdmin(admin, this.imagen);
  //   this.forma.reset();
  //   Swal.fire('Correcto!', 'Registrado!');
  // }

  // onFileSelected($event: any) {
  //   if ($event.target.files.length > 0) {
  //     this.imagen = $event.target.files[0];
  //   }
  // }

  public registerSpecialistForm!: FormGroup;
  specialties: Specialty[] = [];
  specialtiess: string[] = [];
  profileImg?: File;
  selectedImageName: string = "";
  openImageSelector: boolean = true;

  isCaptchaValid!: boolean;

  token: string | undefined;

  constructor(public formBuilder: FormBuilder, private auth: AuthService, public alertService: AlertService, public dialog: MatDialog) {
    this.token = undefined;
  }

  ngOnInit(): void {
    this.registerSpecialistForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: [
        '',
        [Validators.required, Validators.min(18), Validators.max(99)],
      ],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.minLength(7),
          Validators.maxLength(8),
        ],
      ],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      'img-perfil': ['', [Validators.required]],
      recaptcha: ['', [Validators.required]],
    });
  }

  ElegirEspecialidad($event: Specialty[]) {
    this.specialties = $event;
  }

  addSpecialty(specialty: any) {
    if (specialty) {
      this.specialties.push(specialty);
    }
  }

  removeSpecialty(specialty: Specialty) {
    const index = this.specialties.indexOf(specialty);
    if (index !== -1) {
      this.specialties.splice(index, 1);
    }
  }

  selectImage() {
    if (this.openImageSelector) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        this.profileImg = file;
        this.selectedImageName = file.name;
      };
      input.click();
    }
  }

  updateCaptchaValidity(isValid: boolean): void {
    this.isCaptchaValid = isValid;
    console.log("captcha", this.isCaptchaValid);
  }

  register() {
    const admin = new Admin(
      this.registerSpecialistForm.value.firstName,
      this.registerSpecialistForm.value.lastName,
      this.registerSpecialistForm.value.age,
      this.registerSpecialistForm.value.dni,
      this.registerSpecialistForm.value.mail,
      this.registerSpecialistForm.value.password,
      ''
    );
    this.auth.createAdminFromAdmin(admin, this.profileImg);
    this.alertService.alert("success", "Especialista creado exitosamente");
  }
}