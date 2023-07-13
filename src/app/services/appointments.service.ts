import { Injectable } from '@angular/core';
import { addDoc, collectionData, doc, documentId, Firestore, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection, query, where } from '@firebase/firestore';
import { Specialty } from '../classes/specialty';
import { Specialist } from '../classes/specialist';
import { MedicalRecord } from '../classes/medical-record';
import { Schedule } from '../classes/schedule';
import { Patient } from '../classes/patient';
import { Appointment } from '../classes/appointment';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {

  constructor(private firestore: Firestore) { }

  createAppointment(specialist: Specialist, specialty: Specialty, schedule: Schedule, patient: Patient) {
    const appointment = new Appointment(specialist, specialty, schedule, patient);
    const appointmentReference = doc(collection(this.firestore, 'appointment'));
    setDoc(appointmentReference, { ...appointment, id: appointmentReference.id });
  }

  acceptAppointment(appointment: Appointment) {
    const appointmentReference = doc(this.firestore, 'appointment', appointment.id);
    appointment.accepted = true;
    appointment.status = 'accepted';
    updateDoc(appointmentReference, { ...appointment });
  }

  cancelAppointment(appointment: Appointment, comment: string) {
    const appointmentReference = doc(this.firestore, 'appointment', appointment.id);
    appointment.cancelled = true;
    appointment.status = 'cancelled';
    appointment.comment = comment;
    updateDoc(appointmentReference, { ...appointment });
  }

  rejectAppointment(appointment: Appointment, comment: string) {
    const appointmentReference = doc(this.firestore, 'appointment', appointment.id);
    appointment.rejected = true;
    appointment.status = 'rejected';
    appointment.comment = comment;
    updateDoc(appointmentReference, { ...appointment });
  }

  completeAppointment(appointment: Appointment, diagnosis: string, comment: string) {
    const appointmentReference = doc(this.firestore, 'appointment', appointment.id);
    appointment.completed = true;
    appointment.status = 'completed';
    appointment.specialistComment = comment;
    appointment.diagnosis = diagnosis;
    updateDoc(appointmentReference, { ...appointment });
  }

  getAppointments(user: User) {
    console.log("user", user);
    const appointmentCollection = collection(this.firestore, 'appointment');
    if (user.profile === 'patient') {
      const q = query(appointmentCollection, where('patient.mail', '==', user.mail));
      return collectionData(q);
    } else if (user.profile === 'specialist') {
      const q = query(appointmentCollection, where('specialist.mail', '==', user.mail));
      return collectionData(q);
    } else {
      return collectionData(appointmentCollection);
    }
  }

  getAppointmentWithHistoryBySpecialist(patient: Patient, specialist: Specialist) {
    let appointments: Appointment[];

    this.getAppointments(patient as User).forEach((data) => {
      appointments = data as Appointment[];
    });
  }

  getAppointmentBySpecialist(patient: Patient, specialist: Specialist) {
    const appointmentCollection = collection(this.firestore, 'appointment');
    const q = query(appointmentCollection, where('patient.mail', '==', patient.mail), where('specialist.mail', '==', specialist.mail));
    return collectionData(q);
  }

  async getMedicalRecordByID(medicalRecordID: any) {
    const d = doc(this.firestore, 'medicalRecordID/' + medicalRecordID.id);
    const r = await getDoc(d);
    return r.data() as MedicalRecord;
  }

  async updateSchedule(specialist: Specialist, specialty: Specialty, i: number) {
    if (specialist !== null && specialty !== null && i !== -1) {
      
      const specialistsCollection = collection(this.firestore, 'specialists');
      const usersCollection = collection(this.firestore, 'users');

      const q = query(specialistsCollection, where('mail', '==', specialist.mail));
      const q2 = query(usersCollection, where('mail', '==', specialist.mail));

      const snapshot = await getDocs(q);
      const snapshot2 = await getDocs(q2);

      snapshot.forEach((document) => {
        const specialistsReference = doc(specialistsCollection, document.id);
        specialist.specialty[i] = specialty;
        updateDoc(specialistsReference, { ...specialist });
      });

      snapshot2.forEach((document) => {
        const usersReference = doc(usersCollection, document.id);
        specialist.specialty[i] = specialty;
        updateDoc(usersReference, { ...specialist });
      });
    }
  }
}