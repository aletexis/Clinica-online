import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentStatus } from '../../core/models/appointment';

@Pipe({
  name: 'appointmentStatus'
})
export class AppointmentStatusPipe implements PipeTransform {

  private map: Record<AppointmentStatus, string> = {
    pending: 'Pendiente',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    cancelled: 'Cancelado',
    completed: 'Finalizado'
  };

  transform(value: AppointmentStatus): string {
    return this.map[value] || value;
  }
}