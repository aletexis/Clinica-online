import { Patient } from '../classes/patient';
import { getAuth, sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { collection, addDoc } from '@firebase/firestore';
import { doc, Firestore, query, where, collectionData, docData, getDocs, Timestamp } from '@angular/fire/firestore';
import { Specialist } from '../classes/specialist';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { finalize, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FirebaseApp, FirebaseAppSettings, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { User } from '../classes/user';
import { Admin } from '../classes/admin';
import { LoadingService } from './loading.service';
import { ref, uploadBytes, Storage, getDownloadURL } from '@angular/fire/storage';
import { AlertService } from './alert.service';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  emitChangeSource = new Subject<any>();
  usuarioCambio$ = this.emitChangeSource.asObservable();
  user: null | User = null;

  constructor(private firestore: Firestore, private storage: AngularFireStorage, private auth: AngularFireAuth, private router: Router, private loading: LoadingService, private storage2: Storage, private alertService: AlertService) { }

  createSpecialist(specialist: Specialist, profileImg: File | undefined) {
    this.user = new Specialist('', '', '', '', [], '', '', '');
    this.auth
      .createUserWithEmailAndPassword(specialist.mail, specialist.password)
      .then(() => {
        this.auth
          .signInWithEmailAndPassword(specialist.mail, specialist.password)
          .then((user) => {
            const auth = getAuth();
            if (user.user !== null) {
              sendEmailVerification(user.user);
            }
            this.storeSpecialist(specialist, profileImg);
          });
      })
      .catch((err: any) => {
        this.handleError(err.code);
      });
  }

  createPatient(patient: Patient, profileImg: File | undefined, profileImg2: File | undefined) {
    this.user = new Patient('', '', '', '', '', '', '', '', '');
    this.auth
      .createUserWithEmailAndPassword(patient.mail, patient.password)
      .then((user) => {
        const auth = getAuth();
        if (user.user !== null) {
          sendEmailVerification(user.user);
        }
        this.storePatient(patient, profileImg, profileImg2);
      })
      .catch((err: any) => {
        this.handleError(err.code);
      });
  }

  createAdminFromAdmin(admin: Admin, profileImg: File | undefined) {
    this.loading.loading = true;
    const secondaryApp = firebase.initializeApp(environment.firebase, 'SEC');
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(admin.mail, admin.password)
      .then((firebaseUser) => {
        this.storeAdmin(admin, profileImg);
        firebaseUser.user?.sendEmailVerification();
        this.loading.loading = false;
      })
      .catch((err: any) => {
        this.handleError(err.code);
      });
    this.loading.loading = false;
  }

  createSpecialistFromAdmin(specialist: Specialist, profileImg: File | undefined) {
    this.loading.loading = true;
    const secondaryApp = firebase.initializeApp(environment.firebase, 'SEC');
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(specialist.mail, specialist.password)
      .then((firebaseUser) => {
        this.storeSpecialist(specialist, profileImg);
        firebaseUser.user?.sendEmailVerification();
        this.loading.loading = false;
      })
      .catch((err: any) => {
        this.handleError(err.code);
      });
    this.loading.loading = false;
  }

  createPatientFromAdmin(patient: Patient, profileImg: File | undefined, profileImg2: File | undefined) {
    this.loading.loading = true;
    const secondaryApp = firebase.initializeApp(environment.firebase, 'SEC');
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(patient.mail, patient.password)
      .then((firebaseUser) => {
        this.createPatient(patient, profileImg, profileImg2);
        firebaseUser.user?.sendEmailVerification();
        this.loading.loading = false;
      })
      .catch((err: any) => {
        this.handleError(err.code);
      });
    this.loading.loading = false;
  }

  storeAdmin(admin: Admin, profileImg: File | undefined) {
    if (profileImg !== undefined) {

      const filePath = 'profiles/admins/' + admin.firstName + '-' + Date.now();
      const storageRef = this.storage.ref(filePath);
      const uploadFile = storageRef.put(profileImg, { contentType: 'image/png', });

      uploadFile
        .snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe((res) => {
              admin.profileImg = res;
              const adminsCollection = collection(this.firestore, 'admins');
              const usersCollection = collection(this.firestore, 'users');

              this.user = admin;

              addDoc(adminsCollection, { ...admin });
              addDoc(usersCollection, { ...admin });
            });
          })
        )
        .subscribe();
    } else {
      const adminsCollection = collection(this.firestore, 'admins');
      const usersCollection = collection(this.firestore, 'users');
      addDoc(adminsCollection, { ...admin });
      addDoc(usersCollection, { ...admin });
    }
  }

  storeSpecialist(specialist: Specialist, profileImg: File | undefined) {
    if (profileImg !== undefined) {

      const filePath = 'profiles/specialists/' + specialist.firstName + '-' + Date.now();
      const storageRef = this.storage.ref(filePath);
      const uploadFile = storageRef.put(profileImg, { contentType: 'image/png', });

      uploadFile
        .snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe((res) => {
              specialist.profileImg = res;
              const specialistsCollection = collection(this.firestore, 'specialists');
              const usersCollection = collection(this.firestore, 'users');
              const quickAccessCollection = collection(this.firestore, 'quickAccess');

              this.user = specialist;

              addDoc(specialistsCollection, { ...specialist });
              addDoc(usersCollection, { ...specialist });
              addDoc(quickAccessCollection, { ...specialist });
            });
          })
        )
        .subscribe();
    } else {
      const specialistsCollection = collection(this.firestore, 'specialists');
      const usersCollection = collection(this.firestore, 'users');
      const quickAccessCollection = collection(this.firestore, 'quickAccess');
      addDoc(specialistsCollection, { ...specialist });
      addDoc(usersCollection, { ...specialist });
      addDoc(quickAccessCollection, { ...specialist });
    }
  }

  async storePatient(patient: Patient, profileImg: File | undefined, profileImg2: File | undefined) {
    if (profileImg !== undefined) {
      const filePath1 = 'profiles/patients/' + patient.firstName + '-1-' + Date.now();
      const storageRef0 = ref(this.storage2, filePath1);
      await uploadBytes(storageRef0, profileImg);
      const url = await getDownloadURL(storageRef0);
      patient.profileImg = url;
    }

    if (profileImg2 !== undefined) {
      const filePath2 = 'profiles/patients/' + patient.firstName + '-2-' + Date.now();
      const storageRef1 = ref(this.storage2, filePath2);
      await uploadBytes(storageRef1, profileImg2);
      const url = await getDownloadURL(storageRef1);
      patient.profileImg2 = url;
    }

    const patientsCollection = collection(this.firestore, 'patients');
    const usersCollection = collection(this.firestore, 'users');
    const quickAccessCollection = collection(this.firestore, 'quickAccess');

    this.user = patient;

    addDoc(patientsCollection, { ...patient });
    addDoc(usersCollection, { ...patient });
    addDoc(quickAccessCollection, { ...patient });
  }

  handleStateChange() {
    this.auth.onAuthStateChanged(async (user) => {
      this.loading.loading = true;
      if (user !== null) {
        const q = query(
          collection(this.firestore, 'users'),
          where('mail', '==', user.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.data()['profile'] === 'specialist') {
            this.user = doc.data() as Specialist;
          } else if (doc.data()['profile'] === 'patient') {
            this.user = doc.data() as Patient;
          } else if (doc.data()['profile'] === 'admin') {
            this.user = doc.data() as Admin;
          }
        });
        if (this.user !== null) {
          const c = collection(this.firestore, 'logins');
          addDoc(c, {
            user: this.user.firstName + ' ' + this.user.lastName,
            datetime: Timestamp.fromDate(new Date(Date.now())),
          });
          this.emitChangeSource.next(this.user);
          if (this.user.profile === 'specialist') {
            if (user.emailVerified && this.user.approved) {
              this.router
                .navigateByUrl('dashboard-specialist')
                .then(() => (this.loading.loading = false));
            } else {
              this.router
                .navigateByUrl('email-validation')
                .then(() => (this.loading.loading = false));
            }
          } else if (this.user.profile === 'patient') {
            if (user.emailVerified) {
              this.router
                .navigateByUrl('dashboard-patient')
                .then(() => (this.loading.loading = false));
            } else {
              this.router
                .navigateByUrl('email-validation')
                .then(() => (this.loading.loading = false));
            }
          } else if (this.user.profile === 'admin') {
            if (user.emailVerified) {
              this.router
                .navigateByUrl('dashboard-admin')
                .then(() => (this.loading.loading = false));
            } else {
              this.router
                .navigateByUrl('email-validation')
                .then(() => (this.loading.loading = false));
            }
          }
        }
      } else {
        this.emitChangeSource.next(null);
        this.router
          .navigateByUrl('', { replaceUrl: true })
          .then(() => (this.loading.loading = false));
      }
    });
    this.loading.loading = false;
  }

  login(mail: string, password: string) {
    this.loading.loading = true;
    this.auth
      .signInWithEmailAndPassword(mail, password)
      .then(async (user) => {
        const q = query(
          collection(this.firestore, 'users'),
          where('mail', '==', mail.toLocaleLowerCase())
        );

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        console.log(querySnapshot.docs);

        querySnapshot.forEach((document) => {
          console.log("document.data()['profile']", document.data()['profile']);

          if (document.data()['profile'] === 'specialist') {
            this.user = document.data() as Specialist;
          } else if (document.data()['profile'] === 'patient') {
            this.user = document.data() as Patient;
          } else if (document.data()['profile'] === 'admin') {
            this.user = document.data() as Admin;
          } else {
            console.log("aaaaaa");
          }
        });
        this.loading.loading = false;
      })
      .catch((err: any) => {
        this.alertService.alert("error", "Error al iniciar sesión");
        console.log(err);
      });
    this.loading.loading = false;
  }

  logout() {
    this.user = null;
    this.auth.signOut();
  }

  handleError(errorCode: string) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        this.alertService.alert('error', 'El correo electrónico ya está asociado a otra cuenta');
        break;
      case 'auth/weak-password':
        this.alertService.alert('error', 'La contraseña proporcionada es débil. Intentá con una contraseña más segura');
        break;
      case 'auth/invalid-email':
        this.alertService.alert('error', 'El correo electrónico proporcionado es inválido. Verificá tu correo electrónico');
        break;
      case 'auth/operation-not-allowed':
        this.alertService.alert('error', 'La operación no está permitida. Contactá al administrador del sistema');
        break;
      case 'auth/network-request-failed':
        this.alertService.alert('error', 'Se produjo un error de red. Verificá tu conexión a internet y volvé a intentarlo');
        break;
      default:
        this.alertService.alert('error', 'Se produjo un error. Por favor, intentá nuevamente');
        console.error(errorCode);
        break;
    }
  }
}
