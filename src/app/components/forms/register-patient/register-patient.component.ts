import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Specialty } from 'src/app/classes/specialty';
import { Specialist } from 'src/app/classes/specialist';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Patient } from 'src/app/classes/patient';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {

  public registerPatientForm!: FormGroup;
  specialties: Specialty[] = [];
  specialtiess: string[] = [];
  profileImg?: File;
  profileImg2?: File;
  selectedImageName: string = "";
  selectedImageName2: string = "";
  openImageSelector: boolean = true;

  token: string | undefined;

  isCaptchaValid!: boolean;

  constructor(public formBuilder: FormBuilder, private authService: AuthService, public alertService: AlertService, public dialog: MatDialog) {
    this.token = undefined;
  }

  ngOnInit(): void {
    this.registerPatientForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\-]+')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\-]+')]],
      age: ['',
        [Validators.required,
        Validators.min(18),
        Validators.max(99),
        Validators.pattern('[0-9]*')
        ],
      ],
      dni: ['',
        [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(8),
        Validators.pattern('[0-9]*')
        ],
      ],
      healthcareProvider: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      'img-perfil': ['', [Validators.required]],
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

  selectImage2() {
    if (this.openImageSelector) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        this.profileImg2 = file;
        this.selectedImageName2 = file.name;
      };
      input.click();
    }
  }

  updateCaptchaValidity(isValid: boolean): void {
    this.isCaptchaValid = isValid;
  }
  

  register() {
    const patient = new Patient(
      this.registerPatientForm.value.firstName,
      this.registerPatientForm.value.lastName,
      this.registerPatientForm.value.age,
      this.registerPatientForm.value.healthcareProvider,
      this.registerPatientForm.value.dni,
      this.registerPatientForm.value.mail,
      this.registerPatientForm.value.password,
      '',
      ''
    );
    this.authService.createPatient(patient, this.profileImg, this.profileImg2);
  }
}
