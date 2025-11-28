import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const roleToRoute: Record<string, string> = {
    admin: 'admin',
    specialist: 'especialista',
    patient: 'paciente'
  };

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
      router.navigateByUrl(`/dashboard/${roleToRoute[user.role]}`);
      return false;
    })
  );
};