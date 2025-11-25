import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  template: `
    <app-navbar></app-navbar>
    <main class="main-container app-bg">
      <div class="router-content">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    app-navbar {
      flex: 0 0 auto;
    }
    .main-container {
      flex: 1 1 auto;
      padding: 1rem;
      box-sizing: border-box;
    }
    .router-content {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class Layout { }
