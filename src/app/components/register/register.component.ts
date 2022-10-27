import { Component, OnInit } from '@angular/core';
// import { UserService } from '../../services/user.service';
import { User } from '../../classes/user'
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DatePipe } from '@angular/common';
// import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  public user: User;
  date = new Date();
  uid = this.getUid();

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  // confirmedPassword = new FormControl('', [Validators.required]);

  constructor(private router: Router, public dialog: MatDialog) {
    this.user = new User();
    this.user.id = this.uid;
  }

  ngOnInit(): void {
  }

  getUid() {
    return (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
  };

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Ingrese un correo';
    }

    return this.email.hasError('email') ? 'El correo no es válido' : '';
  }

  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'Ingrese una contraseña';
    }

    return this.password.hasError('') ? 'La contraseña no es válida' : '';
  }

  register() {

    // this.alert('info', 'Verificando credenciales')

    if (!(this.user.password == '' && this.user.email == '')) {
      console.log("registro");

      // this.userService.getOne(this.user).valueChanges().subscribe(result => {
      //   if (result.length == 0) {
      //     this.userService.create(this.user).then(() => {
      //       this.alert('success', 'Estás registrado, ¡vamos a jugar!')
      //       localStorage.setItem('token', this.user.email);
      //       this.router.navigateByUrl("home");
      //       console.log("entro al if");
      //       return;
      //     })
      //   }
      // else  {
      //   console.log("entro al else");
      //   console.log('already exist');
      //   this.alert('info', 'Ya estás registrado, iniciá sesión')
      //   this.router.navigateByUrl("login");
      // }
    }
  }


  alert(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: text
    })
  }
}