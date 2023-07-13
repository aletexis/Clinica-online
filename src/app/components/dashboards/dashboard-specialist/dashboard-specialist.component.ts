import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-specialist',
  templateUrl: './dashboard-specialist.component.html',
  styleUrls: ['./dashboard-specialist.component.css']
})
export class DashboardSpecialistComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void { }

  logout() {
    this.authService.logout();
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}