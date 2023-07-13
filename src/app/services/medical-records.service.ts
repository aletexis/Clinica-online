import { Injectable } from '@angular/core';
import { collectionData, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';
import { MedicalRecord } from '../classes/medical-record';
import { Patient } from '../classes/patient';
import { Appointment } from '../classes/appointment';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordsService {
  constructor(private firestore: Firestore) { }

  async addMedicalRecord(medicalRecord: MedicalRecord, appointment: Appointment, diagnosis: string, specialistComment: string) {
    const appointmentReference = doc(this.firestore, 'appointment', appointment.id);
    appointment.completed = true;
    appointment.status = 'completed';
    appointment.specialistComment = specialistComment;
    appointment.diagnosis = diagnosis;
    appointment.other = medicalRecord.other[medicalRecord.other.length - 1];

    let ref = null;
    const medicalRecordsCollection = collection(this.firestore, 'medicalRecords');
    const q = query(medicalRecordsCollection, where('patient.mail', '==', medicalRecord.patient.mail));
    const docs = await getDocs(q);
    docs.forEach((d) => {
      if (d.exists()) {
        ref = d.ref;
      }
    });


    if (ref === null) {
      addDoc(medicalRecordsCollection, { ...medicalRecord }).then((ref) => {
        updateDoc(appointmentReference, {
          ...appointment,
          medicalRecordUpdated: true,
          medicalRecordID: ref,
        });
      });
    } else {
      setDoc(ref, { ...medicalRecord });
      updateDoc(appointmentReference, {
        ...appointment,
        medicalRecordUpdated: true,
        medicalRecordID: ref,
      });
    }
  }

  async getMedicalRecordsByPatient(patient: Patient): Promise<MedicalRecord> {
    let response: MedicalRecord = new MedicalRecord(patient, 5, 5, 0, 0, []);
    const medicalRecordsCollection = collection(this.firestore, 'medicalRecords');
    const q = query(medicalRecordsCollection, where('patient.mail', '==', patient.mail));
    const docs = await getDocs(q);
    docs.forEach((d) => {
      if (d.exists()) {
        response = d.data() as MedicalRecord;
      }
    });
    return response;
  }

  getMedicalRecords() {
    const medicalRecordsCollection = collection(this.firestore, 'medicalRecords');
    return collectionData(medicalRecordsCollection);
  }
}