import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-menu',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './patient-menu.component.html',
  styleUrl: './patient-menu.component.scss'
})
export class PatientMenuComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}