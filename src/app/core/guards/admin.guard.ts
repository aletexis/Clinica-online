import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take, map, combineLatest, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const adminGuard: CanActivateFn = () => {
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

    filter(([initialized, _]) => initialized),
    take(1),

    map(([_, user]) => {

      if (!user) {
        alertService.error('Debés iniciar sesión para acceder a esta sección', 4000);
        router.navigate(['/inicio-sesion']);
        return false;
      }

      if (user.role === 'admin') return true;

      alertService.error('No tenés permisos para acceder a esta sección');
      router.navigate([`/dashboard/${roleToRoute[user.role]}`]);
      return false;
    })
  );
};
