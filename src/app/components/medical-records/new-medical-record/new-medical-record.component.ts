import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from 'src/app/classes/appointment';
import { MedicalRecord } from 'src/app/classes/medical-record';
import { Patient } from 'src/app/classes/patient';
import { MedicalRecordsService } from 'src/app/services/medical-records.service';

@Component({
  selector: 'app-new-medical-record',
  templateUrl: './new-medical-record.component.html',
  styleUrls: ['./new-medical-record.component.css'],
})
export class NewMedicalRecordComponent implements OnInit {
  @Input() turno?: Appointment;

  public forma!: FormGroup;
  medicalRecord!: MedicalRecord;

  constructor(private fb: FormBuilder, private hs: MedicalRecordsService) { }

  ngOnInit(): void {
    this.forma = this.fb.group({
      comentario: ['', [Validators.required]],
      diagnostico: ['', [Validators.required]],
      altura: [this.medicalRecord?.height, [Validators.required]],
      peso: [this.medicalRecord?.weight, [Validators.required]],
      temperatura: [this.medicalRecord?.temperature, [Validators.required]],
      presion: [this.medicalRecord?.pressure, [Validators.required]],
      clave: ['', [Validators.required]],
      valor: ['', [Validators.required]],
    });
    this.hs
      .getMedicalRecordsByPatient(this.turno?.patient!)
      .then((h) => {
        this.medicalRecord = h;
      })
      .then(() => {
        this.forma = this.fb.group({
          comentario: ['', [Validators.required]],
          diagnostico: ['', [Validators.required]],
          altura: [
            this.medicalRecord?.height,
            [Validators.required, Validators.min(1), Validators.minLength(0)],
          ],
          peso: [
            this.medicalRecord?.weight,
            [Validators.required, Validators.min(1), Validators.minLength(0)],
          ],
          temperatura: [
            this.medicalRecord?.temperature,
            [Validators.required],
          ],
          presion: [
            this.medicalRecord?.pressure,
            [Validators.required, Validators.min(1), Validators.minLength(0)],
          ],
          clave: ['', [Validators.required]],
          valor: [
            '',
            [Validators.required, Validators.min(1), Validators.minLength(0)],
          ],
        });
      });
  }

  agregarHistoria() {
    this.medicalRecord.height = this.forma.value.altura;
    this.medicalRecord.weight = this.forma.value.peso;
    this.medicalRecord.temperature = this.forma.value.temperatura;
    this.medicalRecord.pressure = this.forma.value.presion;
    this.turno!.finished = false;
    this.medicalRecord.other.push({
      key: this.forma.value.clave,
      value: this.forma.value.valor,
    });
    this.turno!.key = this.forma.value.clave;
    this.turno!.value = this.forma.value.valor;
    this.hs.addMedicalRecord(
      this.medicalRecord,
      this.turno!,
      this.forma.value.diagnostico,
      this.forma.value.comentario
    );
  }
}
