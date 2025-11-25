import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { SpecialistUser } from '../../../../core/models/user';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoadingService } from '../../../../core/services/loading.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-user-approval.page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './user-approval.page.html',
  styleUrl: './user-approval.page.scss'
})
export class UserApprovalPage {

  specialists: (SpecialistUser & { specialtyNames: string[] })[] = [];
  updatingId: string | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private loadingService: LoadingService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loadingService.startLoading();

    const specialists$ = this.firestoreService.getFiltered<SpecialistUser>('users', 'role', 'specialist');
    const specialties$ = this.firestoreService.getAll<{ id: string; name: string }>('specialties');

    combineLatest([specialists$, specialties$])
      .pipe(
        map(([specialists, specialties]) =>
          specialists.map(spec => ({
            ...spec,
            specialtyNames: spec.specialties.map(
              id => specialties.find(s => s.id === id)?.name ?? '(sin nombre)'
            ),
          }))
        )
      )
      .subscribe({
        next: (mapped) => {
          this.specialists = mapped;
          this.loadingService.stopLoading();
        },
        error: (err) => {
          console.error('Error al cargar especialistas:', err);
          this.loadingService.stopLoading();
        },
      });
  }

  async toggleApproval(user: SpecialistUser) {
    this.updatingId = user.uid;
    this.loadingService.startLoading();

    try {
      await this.firestoreService.update('users', user.uid, {
        approved: !user.approved,
      });
      user.approved = !user.approved;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      this.alertService.error('Hubo un problema al cambiar el estado del usuario', 3500);
    } finally {
      this.updatingId = null;
      this.loadingService.stopLoading();
    }
  }
}
