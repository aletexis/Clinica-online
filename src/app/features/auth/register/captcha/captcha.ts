import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-captcha',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss'
})
export class Captcha {

  @ViewChild('captchaCanvas', { static: true }) captchaCanvas!: ElementRef<HTMLCanvasElement>;
  private captchaCode: string = '';
  userInput: string = '';
  captchaValid = false;
  captchaInvalid = false;

  constructor(private dialogRef: MatDialogRef<Captcha>) { }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaCode = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    this.userInput = '';
    this.captchaValid = false;
    this.captchaInvalid = false;
    this.drawCaptcha();
  }

  drawCaptcha(): void {
    const canvas = this.captchaCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const charWidth = canvas.width / this.captchaCode.length;
    let outlineCount = 0;

    for (let i = 0; i < this.captchaCode.length; i++) {
      const char = this.captchaCode.charAt(i);
      const x = i * charWidth + charWidth / 2;
      const y = canvas.height / 2 + Math.sin(i + Date.now() / 200) * 8;
      const angle = (Math.random() - 0.6) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const useOutline = outlineCount < 2 && Math.random() < 0.3;
      if (useOutline) {
        ctx.strokeStyle = '#292929';
        ctx.lineWidth = 1.5;
        ctx.strokeText(char, 0, 0);
        outlineCount++;
      } else {
        ctx.fillStyle = '#292929';
        ctx.fillText(char, 0, 0);
      }

      ctx.restore();
    }
  }

  validateCaptcha(): void {
    if (this.userInput.trim() === this.captchaCode) {
      this.captchaValid = true;
      this.captchaInvalid = false;

      setTimeout(() => {
        this.dialogRef.close(this.captchaCode);
      }, 1000);
    } else {
      this.captchaValid = false;
      this.captchaInvalid = true;

      this.restartAnimation('.badge.app-text-error');
    }
  }

  private restartAnimation(selector: string) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) {
      el.classList.remove('animate__headShake');
      void el.offsetWidth;
      el.classList.add('animate__headShake');
    }
  }
}