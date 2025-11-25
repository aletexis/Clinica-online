import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

  transform(value: string | null | undefined, fallback: string): string {
    return value && value.trim() !== '' ? value : fallback;
  }
}