import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take, map, combineLatest, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  return combineLatest([
    authService.userInitialized$,
    authService.user$
  ]).pipe(

    filter(([initialized, _]) => initialized),
    take(1),

    map(([_, user]) => {
      if (user) return true;

      alertService.error('Debés iniciar sesión para acceder a esta sección', 4000);
      router.navigate(['/inicio-sesion']);
      return false;
    })
  );
};