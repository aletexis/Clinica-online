import { Appointment } from 'src/app/classes/appointment';
import { collection, query, where } from '@firebase/firestore';
import { collectionData, Firestore, Timestamp } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Login {
  user: string;
  datetime: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {

  constructor(private firestore: Firestore) { }

  getLoginHistory() {
    const loginsCollection = collection(this.firestore, 'logins');
    return collectionData(loginsCollection) as Observable<Login[]>;
  }

  getAppointmentBySpecialty(specialty: string) {
    const appointmentCollection = collection(this.firestore, 'appointment');
    const q = query(appointmentCollection, where('specialty.name', '==', specialty));
    return collectionData(appointmentCollection) as Observable<Appointment[]>;
  }

  getAppointmentsByDay(day: string, month: string) {
    const appointmentCollection = collection(this.firestore, 'appointment');
    const q = query(
      appointmentCollection,
      where('schedule.day', '==', day),
      where('schedule.month', '==', month)
    );
    return collectionData(appointmentCollection) as Observable<Appointment[]>;
  }

  getAppointmentsByDoctorInTimespan() {
    const appointmentCollection = collection(this.firestore, 'appointment');
    const q = query(appointmentCollection, where('completed', '==', false));
    return collectionData(q) as Observable<Appointment[]>;
  }

  getCompletedAppointmentsByDoctorInTimespan() {
    const appointmentCollection = collection(this.firestore, 'appointment');
    const q = query(appointmentCollection, where('completed', '==', true));
    return collectionData(q) as Observable<Appointment[]>;
  }

  compareDates(day: number, month: number, day1: number, day2: number, month1: number, month2: number) {
    if (month >= month1 && month <= month2 && ((day >= day1 && month !== month2) ||
      (day <= day2 && month !== month1) ||
      (month === month1 && month === month2 && day >= day1 && day <= day2))) {
      return true;
    }
    return false;
  }
}
