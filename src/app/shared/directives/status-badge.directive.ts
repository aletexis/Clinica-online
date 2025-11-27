import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[statusBadge]'
})
export class StatusBadgeDirective {

  @Input('statusBadge') status!: string;

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    const native = this.el.nativeElement;
    native.classList.add('badge-pill');
    native.classList.remove('badge-pending', 'badge-accepted', 'badge-cancelled', 'badge-rejected', 'badge-completed');

    switch (this.status) {
      case 'pending':
        native.classList.add('badge-pending');
        break;
      case 'accepted':
        native.classList.add('badge-accepted');
        break;
      case 'cancelled':
        native.classList.add('badge-cancelled');
        break;
      case 'rejected':
        native.classList.add('badge-rejected');
        break;
      case 'completed':
        native.classList.add('badge-completed');
        break;
    }
  }
}