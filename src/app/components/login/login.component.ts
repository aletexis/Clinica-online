import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
// import { UserService } from '../../services/user.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public user: User;
  public logged: Boolean;
  logDate = new Date();

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.required]);

  constructor(public dialog: MatDialog, private router: Router) {
    this.user = new User();
    this.logged = false;
  }

  ngOnInit(): void {
  }

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

  public login() {
    // this.alert('info', 'Verificando credenciales')
    // this.userService.getOne(this.user).valueChanges().subscribe(result => {
    //   if (result.length == 1) {
    //     localStorage.setItem('token', this.user.email)
    //     this.alert('success', 'Bienvenido')
    //     this.router.navigateByUrl("home");
    //   }
    //   else {
    //     this.alert('error', 'Usuario no válido')
    //   }
    // })
  }

  public fastLogin() {
    this.user.email = "invitado@invitado.com";
    this.user.password = '123456';
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

  goTo(place: string) {
    switch (place) {
      case "register":
        this.router.navigateByUrl("register");
        break;
    }
  }
}