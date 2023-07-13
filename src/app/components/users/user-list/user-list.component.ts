import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private appointmentsService: AppointmentsService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.utils.getUsers().subscribe((d) => {
      this.users = d as User[];
    });
  }

  downloadExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'USUARIOS');
    XLSX.writeFile(book, 'Usuarios.xlsx');
  }

  downloadAppointments(user: User) {
    this.appointmentsService.getAppointments(user).forEach((data) => {
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
      XLSX.writeFile(book, 'Turnos de ' + user.firstName + ' ' + user.lastName + '.xlsx'
      );
    });
  }
}
