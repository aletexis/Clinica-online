import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'specialties',
})
export class SpecialtiesPipe implements PipeTransform {
    transform(specialties: any[]): string {
        return specialties.map(s => s.name).join(' - ');
    }
}
