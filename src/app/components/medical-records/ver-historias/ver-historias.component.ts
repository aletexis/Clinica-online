import { Component, OnInit } from '@angular/core';
import { MedicalRecord } from 'src/app/classes/medical-record';
import { Appointment } from 'src/app/classes/appointment';
import { AuthService } from 'src/app/services/auth.service';
import { MedicalRecordsService } from 'src/app/services/medical-records.service';
import { AppointmentsService } from 'src/app/services/appointments.service';

@Component({
  selector: 'app-ver-historias',
  templateUrl: './ver-historias.component.html',
  styleUrls: ['./ver-historias.component.scss'],
})
export class VerHistoriasComponent implements OnInit {
  historias: MedicalRecord[] = [];
  historiasFiltradas: MedicalRecord[] = [];
  misTurnos: Appointment[] = [];
  constructor(
    private hs: MedicalRecordsService,
    private auth: AuthService,
    private turnosService: AppointmentsService
  ) { }

  ngOnInit(): void {
    this.turnosService.getAppointments(this.auth.user!).forEach((d) => {
      this.misTurnos = d as Appointment[];
    });
    this.hs.getMedicalRecords().subscribe((h) => {
      this.historias = h as MedicalRecord[];
      this.historiasFiltradas = h as MedicalRecord[];
      if (this.auth.user!.profile === 'Especialista') {
        this.historiasFiltradas = this.historias.filter((h) => {
          for (const element of this.misTurnos) {
            if (element.patient.mail === h.patient.mail) {
              return true;
            }
          }
          return false;
        });
      }
      console.log(this.historiasFiltradas);
    });
  }
}
