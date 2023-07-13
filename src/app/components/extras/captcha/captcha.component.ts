import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {

  captchaCode!: string;
  userInput!: string;
  captchaValid: boolean = false;
  captchaInvalid: boolean = false;
  @Output() captchaValidated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    this.generateCaptcha();
  }

  ngOnInit(): void {
  }

  generateCaptcha(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * characters.length);
      captcha += characters.charAt(index);
    }
    this.captchaCode = captcha;
  }

  validateCaptcha(): void {
    if (this.userInput === this.captchaCode) {
      this.captchaValid = true;
      this.captchaInvalid = false;
      this.captchaValidated.emit(true);
    } else {
      this.captchaValid = false;
      this.captchaInvalid = true;
      this.captchaValidated.emit(false);
    }
  }
}
