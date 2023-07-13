import { getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { collection, query } from '@firebase/firestore';
import { Firestore, getDocs, where } from '@angular/fire/firestore';
import { Specialist } from 'src/app/classes/specialist';
import { Patient } from 'src/app/classes/patient';
import { Router } from '@angular/router';
import Swall from 'sweetalert2'
import { Admin } from 'src/app/classes/admin';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.component.html',
  styleUrls: ['./email-validation.component.css']
})
export class EmailValidationComponent implements OnInit {

  constructor(private authService: AuthService, private firestore: Firestore, private router: Router, private l: LoadingService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

  async confirmEmailValidation() {
    this.l.loading = true;
    let auth = getAuth();
    auth.currentUser?.reload();

    if (auth.currentUser !== null) {
      const q = query(collection(this.firestore, 'users'), where("mail", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {

        if (doc.data()['profile'] === "specialist") {
          this.authService.user = doc.data() as Specialist;

        } else if (doc.data()['profile'] === "patient") {
          this.authService.user = doc.data() as Patient;

        } else if (doc.data()['profile'] === "admin") {
          this.authService.user = doc.data() as Admin;
        }
      });

      if (this.authService.user !== null) {
        if (this.authService.user.profile === 'specialist') {
          if (auth.currentUser.emailVerified) {
            if (this.authService.user.approved) {
              this.router.navigateByUrl('dashboard-specialist')
                .then(() => this.l.loading = false)
            }
            else {
              Swall.fire('Error', 'Disculpá las molestias, pero tu cuenta aún no ha sido aprobada por un administrador. Por favor, volvé a consultar más trade', 'error');
            }
          }
          else {
            Swall.fire('Error', 'Valide su mail antes de continuar', 'error');
          }
        }
        else if (this.authService.user.profile === 'patient') {
          if (auth.currentUser.emailVerified) {
            this.router.navigateByUrl('dashboard-patient')
              .then(() => this.l.loading = false)
          }
          else {
            Swall.fire('Error', 'Valide su mail antes de continuar', 'error');
          }
        }
        else if (this.authService.user.profile === 'admin') {
          if (auth.currentUser.emailVerified) {
            this.router.navigateByUrl('dashboard-admin')
              .then(() => this.l.loading = false)
          }
          else {
            Swall.fire('Error', 'Valide su mail antes de continuar', 'error');
          }
        }
      }
      else {
        this.router.navigateByUrl('')
          .then(() => this.l.loading = false)
      }
      this.l.loading = false;
    }
  }
}
