import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  username: string = '';
  password: string = '';

  constructor(public formBuilder: FormBuilder, private auth: AuthService, public alertService: AlertService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  fillFields(data: { username: string, password: string }) {
    this.username = data.username;
    this.password = data.password;
  }

  login() {
    console.log("login");
    this.auth.login(
      this.loginForm.value.mail,
      this.loginForm.value.password
    );
  }
}