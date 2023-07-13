import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-patient',
  templateUrl: './dashboard-patient.component.html',
  styleUrls: ['./dashboard-patient.component.css'],
})
export class DashboardPatientComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void { }

  logout() {
    this.authService.logout();
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
