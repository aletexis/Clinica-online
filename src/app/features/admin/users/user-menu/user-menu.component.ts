import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}