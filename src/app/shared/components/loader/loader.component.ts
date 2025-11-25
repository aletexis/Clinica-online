import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  isLoading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }
}