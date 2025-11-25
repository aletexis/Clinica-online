import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-specialist-menu',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './specialist-menu.component.html',
  styleUrl: './specialist-menu.component.scss'
})
export class SpecialistMenuComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}