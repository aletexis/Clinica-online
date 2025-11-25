import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  return combineLatest([
    authService.userInitialized$,
    authService.user$
  ]).pipe(
    filter(([initialized, _]) => initialized === true),
    take(1),
    map(([_, user]) => {
      if (!user) {
        return true;
      }
      alertService.info('Ya tenés una sesión iniciada');
      router.navigateByUrl(`/dashboard/${user.role}`);
      return false;
    })
  );
};