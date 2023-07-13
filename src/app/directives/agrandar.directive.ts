import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAgrandar]',
})
export class AgrandarDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    this.cambiar('none');
    setTimeout(() => {
      this.cambiar('block');
    }, 2000);
  }

  @HostListener('mouseleave') onMouseLeave() {}

  private cambiar(d: string) {
    this.el.nativeElement.style.display = d;
  }
}
