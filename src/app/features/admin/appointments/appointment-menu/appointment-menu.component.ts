import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment-menu.component',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './appointment-menu.component.html',
  styleUrl: './appointment-menu.component.scss'
})
export class AppointmentMenuComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}
