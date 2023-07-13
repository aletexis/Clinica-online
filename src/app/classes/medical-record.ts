import { Patient } from './patient';

export class MedicalRecord {
  height: number;
  weight: number;
  temperature: number;
  pressure: number;
  patient: Patient;
  other: Other[];

  constructor(
    patient: Patient,
    height: number,
    weight: number,
    temperature: number,
    pressure: number,
    other: Other[]
  ) {
    this.height = height;
    this.weight = weight;
    this.temperature = temperature;
    this.pressure = pressure;
    this.other = other;
    this.patient = patient;
  }
}

interface Other {
  key: string;
  value: string;
}
