import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-specialist',
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class DashboardSpecialistPage {
}