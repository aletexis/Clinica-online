import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-user-list.page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './user-list.page.html',
  styleUrl: './user-list.page.scss'
})
export class UserListPage {

  constructor(
    private firestoreService: FirestoreService,
    private loadingService: LoadingService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    // this.loadingService.startLoading();

    //   const specialists$ = this.firestoreService.getFiltered<SpecialistUser>('users', 'role', 'specialist');
    //   const specialties$ = this.firestoreService.getAll<{ id: string; name: string }>('specialties');

    //   combineLatest([specialists$, specialties$])
    //     .pipe(
    //       map(([specialists, specialties]) =>
    //         specialists.map(spec => ({
    //           ...spec,
    //           specialtyNames: spec.specialties.map(
    //             id => specialties.find(s => s.id === id)?.name ?? '(sin nombre)'
    //           ),
    //         }))
    //       )
    //     )
    //     .subscribe({
    //       next: (mapped) => {
    //         this.specialists = mapped;
    //         this.loadingService.stopLoading();
    //       },
    //       error: (err) => {
    //         console.error('Error al cargar especialistas:', err);
    //         this.loadingService.stopLoading();
    //       },
    //     });
    // }

  }
}
