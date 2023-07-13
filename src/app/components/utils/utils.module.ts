import { FormsModule } from '@angular/forms';
import { ElegirEspecialidadComponent } from './elegir-especialidad/elegir-especialidad.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailValidationComponent } from '../extras/email-validation/email-validation.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingComponent } from './loading/loading.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../extras/navbar/navbar.component';



@NgModule({
  declarations: [
    ElegirEspecialidadComponent,
    EmailValidationComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ], 
  exports: [
    ElegirEspecialidadComponent,
    EmailValidationComponent,
    LoadingComponent
  ]
})
export class UtilsModule { }
