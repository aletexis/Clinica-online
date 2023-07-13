import { Component, Input, OnInit } from '@angular/core';
import { MedicalRecord } from 'src/app/classes/medical-record';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-mi-historia',
  templateUrl: './mi-historia.component.html',
  styleUrls: ['./mi-historia.component.scss'],
})
export class MiHistoriaComponent implements OnInit {
  @Input() medicalRecord?: MedicalRecord;
  mostrar = false;

  constructor(public auth: AuthService, private turnosServie: AppointmentsService) { }

  ngOnInit(): void { }

  cambio() {
    this.mostrar = !this.mostrar;
  }

  descargarTurnos(user: User) {
    this.turnosServie.getAppointments(user).forEach((data) => {
      data.forEach((data: any) => {
        data.specialty = data.specialty.name;
        data.specialist = data.specialist.name;
        delete data.other;
        delete data.medicalRecordID;
        delete data.id;
        delete data.patient;
        delete data.finished;
        data.schedule =
          data.schedule.day +
          '/' +
          data.schedule.month +
          ' - ' +
          data.schedule.hour +
          ':' +
          data.schedule.minute;
      });

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, 'TURNOS');
      XLSX.writeFile(book, 'Turnos de de ' + user.firstName + ' ' + user.lastName + '.xlsx'
      );
    });
  }
}
