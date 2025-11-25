import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, Subscription, switchMap } from 'rxjs';
import { AppUser } from '../../models/user';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentRoute = '';
  loggedInUser: AppUser | null = null;
  authResolved = false;
  private subs: Subscription[] = [];

  ngOnInit() {
    const routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => (this.currentRoute = event.urlAfterRedirects));
    this.subs.push(routeSub);

    const userSub = this.authService.user$.subscribe(user => {
      this.loggedInUser = user;
      this.authResolved = true;
    });
    this.subs.push(userSub);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  goBack() {
    window.history.back();
  }

  get isLogged() {
    return !!this.loggedInUser;
  }

  // Dashboard por rol
  get dashboardRoute(): string {
    if (!this.loggedInUser) return '/bienvenida';
    return `/dashboard/${this.loggedInUser.role}`;
  }

  get isOnDashboard(): boolean {
    return this.currentRoute === this.dashboardRoute;
  }

  goHome() {
    this.router.navigateByUrl(this.dashboardRoute);
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('inicio-sesion');
  }

  // Visibilidad botones
  get hideNavbar(): boolean {
    return !this.isLogged && this.currentRoute === '/bienvenida';
  }

  get showBackButton(): boolean {
    if (!this.isLogged) return false;
    return !this.isOnDashboard;
  }

  get showDashboardButton(): boolean {
    return this.isLogged && !this.isOnDashboard;
  }

  get showWelcomeButton(): boolean {
    if (this.currentRoute === '/bienvenida') return false;
    return true;
  }

  get showLoginButton(): boolean {
    const registerRoutes = [
      '/registro',
      '/registro-especialista',
      '/registro-paciente',
    ];

    return (
      this.authResolved &&
      !this.loggedInUser &&
      registerRoutes.some(r => this.currentRoute.startsWith(r))
    );
  }

  get showRegisterButton(): boolean {
    return !this.isLogged && this.currentRoute === '/inicio-sesion';
  }

  get showLogout(): boolean {
    return this.isLogged;
  }
}