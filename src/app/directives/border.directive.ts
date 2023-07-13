import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appBorder]',
})
export class BorderDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.cambiar('#EE7734', 'solid', '2px');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.cambiar('#FFFFFF', 'solid', '2px');
  }

  private cambiar(color: string, style: string, width: string) {
    this.el.nativeElement.style.borderColor = color;
    this.el.nativeElement.style.borderStyle = style;
    this.el.nativeElement.style.borderWidth = width;
  }
}