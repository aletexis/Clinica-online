import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'altura',
})
export class AlturaPipe implements PipeTransform {
  transform(value: number, ...args: string[]): string {
    return value + ' cm.';
  }
}
