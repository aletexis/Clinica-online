import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DayAvailability } from '../../../core/models/specialistAvailability';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../../core/services/firestore.service';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-specialist-availability',
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './specialist-availability.component.html',
  styleUrl: './specialist-availability.component.scss'
})
export class SpecialistAvailabilityComponent {

  @Output() saved = new EventEmitter<void>();
  @Input() existingAvailability: any[] | null = null;

  private firestore = inject(FirestoreService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);

  hours: string[] = [];
  days: DayAvailability[] = [];
  errors: Record<string, (string | null)[]> = {};
  availability: any[] = [];

  ngOnInit() {
    if (!this.existingAvailability) {
      this.generateDays();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['existingAvailability'] && this.existingAvailability) {
      const fbData = this.existingAvailability[0].availability;

      this.days = fbData.map((d: DayAvailability) => ({
        day: d.day,
        ranges: d.ranges.map(r => ({ start: r.start, end: r.end }))
      }));

      this.errors = {};
      for (const d of this.days) {
        this.errors[d.day] = d.ranges.map(() => null);
      }
    }
  }

  getStartHours(dayName: string): string[] {
    let startHour = 8;
    let endHour = dayName === 'Sábado' ? 13.5 : 18.5;
    const list: string[] = [];

    for (let h = startHour; h <= Math.floor(endHour); h++) {
      list.push(`${h.toString().padStart(2, '0')}:00`);
      if (h + 0.5 <= endHour) list.push(`${h.toString().padStart(2, '0')}:30`);
    }

    return list;
  }

  getEndHours(dayName: string): string[] {
    let startHour = 8.5;
    let endHour = dayName === 'Sábado' ? 14 : 19;
    const list: string[] = [];

    for (let h = 8; h < endHour; h++) {
      list.push(`${h.toString().padStart(2, '0')}:30`);
      list.push(`${(h + 1).toString().padStart(2, '0')}:00`);
    }

    return list.filter(time => {
      const [h, m] = time.split(':').map(Number);
      return h + m / 60 >= 8;
    }).slice(0, Math.ceil((endHour - 8) * 2));
  }

  generateDays() {
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    this.days = dayNames.map(d => ({
      day: d,
      ranges: [{ start: null, end: null }]
    }));

    this.errors = {};
    for (let d of this.days) {
      this.errors[d.day] = [null];
    }
  }

  addRange(day: DayAvailability) {
    day.ranges.push({ start: null, end: null });
    this.errors[day.day].push(null);
  }

  removeRange(day: DayAvailability, index: number) {
    day.ranges.splice(index, 1);
    this.errors[day.day].splice(index, 1);
  }

  validateOverlap(day: DayAvailability, index: number): boolean {
    const current = day.ranges[index];
    if (!current.start || !current.end) return false;

    const currStart = current.start;
    const currEnd = current.end;

    for (let i = 0; i < day.ranges.length; i++) {
      if (i === index) continue;
      const r = day.ranges[i];
      if (!r.start || !r.end) continue;

      if (currStart < r.end && currEnd > r.start) {
        return true;
      }
    }
    return false;
  }

  validateRange(day: DayAvailability, index: number) {
    const r = day.ranges[index];
    let err: string | null = null;

    if (!r.start && !r.end) err = null;
    else if (r.start && !r.end) err = 'Debe seleccionar una hora de fin';
    else if (!r.start && r.end) err = 'Debe seleccionar una hora de inicio';
    else if (r.start && r.end && r.start >= r.end) err = 'La hora de inicio debe ser menor que la de fin';
    else if (this.validateOverlap(day, index)) err = 'Este rango se superpone con otro';

    this.errors[day.day][index] = err;
  }

  hasErrors(): boolean {
    return Object.values(this.errors).some(list => list.some(e => e !== null));
  }

  async saveAvailability() {
    if (this.hasErrors()) {
      this.alertService.error('Hay errores en los horarios. Revisalos antes de guardar', 3000);
      return;
    }

    const user = this.authService.userSubject.getValue();
    if (!user) {
      this.alertService.error('No se pudo obtener el usuario actual');
      return;
    }

    const availability = this.days;

    this.loadingService.startLoading();

    try {
      await this.firestore.setDocument('specialistAvailability', user.uid, {
        uid: user.uid,
        availability
      });

      this.saved.emit();
      this.alertService.success('Disponibilidad guardada con éxito');
    } catch (err) {
      console.error(err);
      this.alertService.error('Hubo un problema al guardar la disponibilidad', 3000);
    } finally {
      this.loadingService.stopLoading();
    }
  }
}