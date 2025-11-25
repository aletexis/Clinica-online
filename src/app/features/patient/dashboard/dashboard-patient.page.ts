import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-patient',
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class DashboardPatientPage {
}