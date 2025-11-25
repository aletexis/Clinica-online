import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { AppUser } from '../../../core/models/user';

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss'
})
export class WelcomePage {

  private router = inject(Router);
  private authService = inject(AuthService);
  loggedInUser: AppUser | null = null;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}