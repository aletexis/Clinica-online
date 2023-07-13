import { Component, OnInit } from '@angular/core';
import { Specialty } from 'src/app/classes/specialty';
import { Specialist } from 'src/app/classes/specialist';
import { Schedule } from 'src/app/classes/schedule';
import { Patient } from 'src/app/classes/patient';
import { AuthService } from 'src/app/services/auth.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss'],
})
export class SolicitarTurnoComponent implements OnInit {

  filteredSpecialists: Specialist[] = [];
  specialists: Specialist[] = [];
  specialties: Specialty[] = [];
  schedules: Schedule[] | null = null;
 
  specialist: Specialist | null = null;
  specialty: Specialty | null = null;
  schedule: Schedule | null = null;


  constructor(private appointmentsService: AppointmentsService, private auth: AuthService, private service: UtilsService) { }
  

  ngOnInit(): void {
    this.service.getSpecialties().subscribe((doc) => {
      this.specialties = doc as Specialty[];
    });

    this.service.getSpecialists().subscribe((doc) => {
      this.specialists = doc as Specialist[];
    });
  }

  chooseSpecialty(specialty: Specialty) {
    this.specialty = specialty;
    this.specialist = null;
    this.schedules = null;
    this.schedule = null;
    
    this.filteredSpecialists = this.specialists.filter(
      (specialist: Specialist) => {
        const r = specialist.specialty.find((sp) => {
          return sp.name === specialty.name && specialist.approved;
        });
        if (r !== undefined) {
          return specialist.specialty.indexOf(r) >= 0;
        } else {
          return false;
        }
      }
    );
  }

  chooseSpecialist(specialist: Specialist) {
    this.specialist = specialist;
    this.schedule = null;

    const s = specialist.specialty.find((sp) => {
      return sp.name === this.specialty!.name;
    })?.schedules;

    if (s !== undefined) {
      this.schedules = s;
    } else {
      //ALERTEAR
    }
  }

  chooseSchedule(schedule: Schedule) {
    this.schedule = schedule;
  }

  acceptAppointment() {
    this.appointmentsService.createAppointment(
      this.specialist!,
      this.specialty!,
      this.schedule!,
      this.auth.user as Patient
    );
    Swal.fire(
      'Todo correcto!',
      'El turno fue registrado correctamente',
      'success'
    );
    this.specialty = null;
    this.specialist = null;
    this.schedule = null;
  }
}