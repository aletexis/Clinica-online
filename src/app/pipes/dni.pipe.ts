import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dni',
})
export class DniPipe implements PipeTransform {
  transform(value: string, ...args: string[]): string {
    return (
      value.substring(0, value.length - 6) +
      '.' +
      value.substring(value.length - 6, value.length - 3) +
      '.' +
      value.substring(value.length - 3, value.length)
    );
  }
}
