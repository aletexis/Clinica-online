import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-user',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './dashboard-user.page.html',
})
export class DashboardUserPage {
}