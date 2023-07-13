import { Injectable } from '@angular/core';
import { collectionData, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, Storage, uploadBytes } from '@angular/fire/storage';
import { addDoc, collection } from '@firebase/firestore';
import { ref, uploadString } from 'firebase/storage';
import { Admin } from '../classes/admin';
import { Specialty } from '../classes/specialty';
import { Specialist } from '../classes/specialist';
import { Patient } from '../classes/patient';
import { User } from '../classes/user';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  constructor(private firestore: Firestore, private l: LoadingService, private storage: Storage, private auth: AuthService) { }

  getSpecialists() {
    const specialistsCollection = collection(this.firestore, 'specialists');
    return collectionData(specialistsCollection);
  }

  getSpecialties() {
    const specialtiesCollection = collection(this.firestore, 'specialties');
    return collectionData(specialtiesCollection);
  }

  getPatients() {
    const patientsCollection = collection(this.firestore, 'patients');
    return collectionData(patientsCollection);
  }

  getUsers() {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection);
  }


  async getUser(mail: string): Promise<User> {
    let user: User;
    const q = query(collection(this.firestore, 'users'), where('mail', '==', mail));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      if (doc.data()['profile'] === 'specialist') {
        user = doc.data() as Specialist;
      } else if (doc.data()['profile'] === 'patient') {
        user = doc.data() as Patient;
      } else if (doc.data()['profile'] === 'admin') {
        user = doc.data() as Admin;
      } else {
        user = this.auth.user!;
      }
    });
    return user!;
  }

  getSpecialistsNotApproved() {
    const col = collection(this.firestore, 'specialists');
    const q = query(col, where('approved', '==', false));
    return collectionData(q);
  }

  async aniadirEspecialidad(specialty: Specialty, img: File) {

    const path = 'specialties/' + specialty.name;
    const storageReference = ref(this.storage, path);

    await uploadBytes(storageReference, img);

    const imageUrl = await getDownloadURL(storageReference);
    specialty.image = imageUrl;

    const col = collection(this.firestore, 'specialties');
    addDoc(col, { ...specialty });
  }

  async approveSpecialist(mail: string) {

    const specialistsCollection = collection(this.firestore, 'specialists');
    const usersCollection = collection(this.firestore, 'users');
    const q = query(specialistsCollection, where('mail', '==', mail));
    const q2 = query(usersCollection, where('mail', '==', mail));

    let querySnapshot = await getDocs(q);
    let querySnapshot2 = await getDocs(q2);

    querySnapshot.forEach((d) => {
      let specialist = d.data() as Specialist;
      specialist.approved = true;
      updateDoc(d.ref, { ...specialist });
    });

    querySnapshot2.forEach((d) => {
      let specialist = d.data() as Specialist;
      specialist.approved = true;
      updateDoc(d.ref, { ...specialist });
    });
  }

  async getQuickAccessUsers(): Promise<User[]> {
    const quickAccessCollection = collection(this.firestore, 'quickAccess');
    const quickAccess = await getDocs(quickAccessCollection);

    let users: User[] = [];

    quickAccess.forEach((doc) => {
      users.push(doc.data() as User);
    });

    return users;
  }
}