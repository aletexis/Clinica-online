import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Specialty } from 'src/app/classes/specialty';
import { Schedule } from 'src/app/classes/schedule';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { MedicalRecord } from 'src/app/classes/medical-record';
import { MedicalRecordsService } from 'src/app/services/medical-records.service';
import { Patient } from 'src/app/classes/patient';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Specialist } from 'src/app/classes/specialist';
import { Appointment } from 'src/app/classes/appointment';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { UtilsService } from 'src/app/services/utils.service';
import { DniPipe } from 'src/app/pipes/dni.pipe';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit, OnDestroy {

  user: User | any;
  unsub: Subscription = new Subscription();
  i: number = -1;

  day: number = 0;
  month: number = 0;
  hour: number = 0;
  minute: number = 0;

  medicalRecord?: MedicalRecord;

  specialty?: Specialty;
  filteredSpecialists: Specialist[] = [];


  constructor(public authService: AuthService, private appointmentService: AppointmentsService, private medicalRecords: MedicalRecordsService, private utilsService: UtilsService) {

  }

  ngOnInit(): void {
    if (this.authService.user !== null) {
      this.medicalRecords.getMedicalRecordsByPatient(this.authService.user as Patient).then((medicalRecord) => {
        this.medicalRecord = medicalRecord;
        console.log(medicalRecord);
      });
    }

    this.utilsService.getSpecialists().subscribe((doc) => {
      const specialists = doc as Specialist[];
      this.filteredSpecialists = specialists.filter((specialist: Specialist) => {
        return specialist.approved;
      });
    });

    this.user = this.authService.user;
    this.unsub = this.authService.usuarioCambio$.subscribe((user) => {
      if (user !== null) {
        console.log(user);
        this.user = user;
        this.medicalRecords.getMedicalRecordsByPatient(user as Patient).then((medicalRecord) => {
          this.medicalRecord = medicalRecord;
          console.log(medicalRecord);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsub.unsubscribe();
  }

  selectSpecialty(specialty: Specialty, i: number) {
    this.specialty = specialty;
    this.i = i;
  }

  addSchedule() {
    if (
      this.specialty !== null &&
      this.day > 0 &&
      this.month > 0 &&
      this.hour > 0 &&
      this.minute > 0
    ) {
      const schedule = new Schedule(this.day, this.month, this.hour, this.minute);
      console.log(this.specialty?.schedules.push({ ...schedule }));

      if (this.specialty !== undefined) {
        this.appointmentService.updateSchedule(this.user, this.specialty, this.i);
      }
    }
  }

  async downloadMyMedicalRecord() {
    let img: string = '';
    const medicalRecord = this.medicalRecord!;
    const user = this.authService.user!;
    var request = new XMLHttpRequest();

    request.open('GET', '../../../assets/logoClinica.png', true);
    request.responseType = 'blob';
    request.onload = function () {

      var reader = new FileReader();
      console.log(typeof request.response);
      reader.readAsDataURL(request.response as Blob);

      reader.onload = function (e) {
        console.log('DataURL:', e.target!.result);
        img = e.target!.result as string;
        let added: { text: string }[] = [];

        medicalRecord.other.forEach((other) => {
          console.log(other);
          added.push({
            text: other.key + ': ' + other.value,
          });
        });

        const data: TDocumentDefinitions = {
          content: [
            {
              image: img,
              width: 150,
            },
            {
              text:
                'Historia clínica de ' + user.firstName + ' ' + user.lastName,
              style: 'header2',
            },
            {
              text:
                'Fecha de emisión: ' + new Date(Date.now()).toLocaleDateString(),
              style: 'header',
            },
            {
              text: 'Altura: ' + medicalRecord.height.toString(),
            },
            {
              text: 'Peso: ' + medicalRecord.weight.toString(),
            },
            {
              text: 'Temperatura: ' + medicalRecord.temperature.toString(),
            },
            {
              text: 'Presion: ' + medicalRecord.pressure.toString(),
            },
            {
              text: 'Diagnósticos: ',
              style: 'header',
            },
            added!,
          ],
          styles: {
            header: {
              bold: true,
              fontSize: 15,
              alignment: 'center',
              margin: 5,
            },
            header2: {
              bold: true,
              fontSize: 20,
              alignment: 'center',
              margin: 2,
            },
          },
          defaultStyle: {
            alignment: 'center',
            fontSize: 12,
          },
        };

        pdfMake.createPdf(data).download();
      };
    };
    request.send();
  }

  downloadAppointmentByProfessional(specialist: Specialist) {
    this.appointmentService
      .getAppointmentBySpecialist(
        this.authService.user as Patient,
        specialist
      )
      .forEach((d) => {
        let data = d as any[];
        data.forEach((data: any) => {
          data.specialty = data.specialty.name;
          data.specialist = data.specialist.name;
          delete data.other;
          delete data.medicalRecordID;
          delete data.id;
          delete data.patient;
          delete data.finished;
          data.schedule = data.schedule.day + '/' + data.schedule.month + ' - ' + data.schedule.hour + ':' + data.schedule.minute;
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const book: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(book, worksheet, specialist.firstName + ' ' + specialist.lastName);
        XLSX.writeFile(book, 'Mis turnos segun' + specialist.firstName + ' ' + specialist.lastName + '.xlsx');
      });
  }
}
