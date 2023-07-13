import { Specialty } from './specialty';
import { Specialist } from './specialist';
import { Schedule } from './schedule';
import { Patient } from './patient';

export class Appointment {
  specialist: Specialist;
  specialty: Specialty;
  schedule: Schedule;
  patient: Patient;
  accepted: boolean;
  completed: boolean;
  rejected: boolean;
  cancelled: boolean;
  comment: string;
  specialistComment: string;
  diagnosis: string;
  status: string;
  id: string;
  medicalRecordID: any;
  finished = false;
  key: string;
  value: string;
  other: Other;

  constructor(
    specialist: Specialist,
    specialty: Specialty,
    schedule: Schedule,
    patient: Patient
  ) {
    this.specialist = specialist;
    this.specialty = specialty;
    this.schedule = schedule;
    this.patient = patient;
    this.accepted = false;
    this.completed = false; //realizado
    this.rejected = false;
    this.cancelled = false;
    this.status = 'requested';
    this.comment = '';
    this.id = '';
    this.diagnosis = '';
    this.specialistComment = '';
    this.medicalRecordID = '';
    this.key = '';
    this.value = '';
    this.other = { key: '', value: '' };
  }
}

interface Other {
  key: string;
  value: string;
}



// export class Turno {
  //   especialista: Specialist;
  //   especialidad: Especialidad;
  //   horario: Horario;
  //   paciente: Patient;
  //   aceptado: boolean;
  //   realizado: boolean;
  //   rechazado: boolean;
  //   cancelado: boolean;
  //   comentario: string;
  //   comentarioEspecialista: string;
  //   diagnostico: string;
  //   estado: string;
  //   id: string;
  //   idHistoria: any;
  //   finalizar = false;
  //   clave: string;
  //   valor: string;
  //   dinamicos: dinamicos;
  
  //   constructor(
  //     especialista: Specialist,
  //     especialidad: Especialidad,
  //     horario: Horario,
  //     paciente: Patient
  //   ) {
  //     this.especialista = especialista;
  //     this.especialidad = especialidad;
  //     this.horario = horario;
  //     this.paciente = paciente;
  //     this.aceptado = false;
  //     this.realizado = false;
  //     this.rechazado = false;
  //     this.cancelado = false;
  //     this.estado = 'Solicitado';
  //     this.comentario = '';
  //     this.id = '';
  //     this.diagnostico = '';
  //     this.comentarioEspecialista = '';
  //     this.idHistoria = '';
  //     this.clave = '';
  //     this.valor = '';
  //     this.dinamicos = { clave: '', valor: '' };
  //   }
  // }
  // interface dinamicos {
  //   clave: string;
  //   valor: string;
  // }
  