import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Specialty } from 'src/app/classes/specialty';
import { Specialist } from 'src/app/classes/specialist';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-crear-especialista',
  templateUrl: './crear-especialista.component.html',
  styleUrls: ['./crear-especialista.component.scss'],
})
export class CrearEspecialistaComponent implements OnInit {
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
    const especialista = new Specialist(
      this.registerSpecialistForm.value.firstName,
      this.registerSpecialistForm.value.lastName,
      this.registerSpecialistForm.value.age,
      this.registerSpecialistForm.value.dni,
      this.specialties,
      this.registerSpecialistForm.value.mail,
      this.registerSpecialistForm.value.password,
      ''
    );
    this.auth.createSpecialist(especialista, this.profileImg);
    this.alertService.alert("success", "Especialista creado exitosamente");
  }
}
