import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amPmTime'
})
export class AmPmTimePipe implements PipeTransform {

  transform(time: string | null): string {
    if (!time) return '';

    let [h, m] = time.split(':').map(Number);

    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
}