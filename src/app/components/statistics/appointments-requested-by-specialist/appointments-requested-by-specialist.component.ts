import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/classes/appointment';
import { StatisticsService } from 'src/app/services/statistics.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-appointments-requested-by-specialist',
  templateUrl: './appointments-requested-by-specialist.component.html',
  styleUrls: ['./appointments-requested-by-specialist.component.css'],
})
export class AppointmentsRequestedBySpecialistComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public pieChartLabels: string[] = [];
  public pieChartDatasets: any[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  data: Appointment[] = [];
  unsub: Subscription = new Subscription();

  day1: number = 1;
  month1: number = 1;
  day2: number = 31;
  month2: number = 12;

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    this.unsub.unsubscribe();
    this.unsub = this.statisticsService
      .getAppointmentsByDoctorInTimespan()
      .subscribe((data: Appointment[]) => {
        this.data = data;
        this.searchAppointments();
      });
  }

  public pieChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  searchAppointments() {
    this.pieChartDatasets = [];
    this.pieChartLabels = [];
    const filteredAppointments = this.data.filter((appointment) => {
      return this.statisticsService.compareDates(
        appointment.schedule.day,
        appointment.schedule.month,
        this.day1,
        this.day2,
        this.month1,
        this.month2
      );
    });

    const specialists: string[] = [];

    filteredAppointments.forEach((appointment) => {
      specialists.push(appointment.specialist.firstName + ' ' + appointment.specialist.lastName);
    });
    const uniqueSpecialists = specialists.filter((specialist, i) => {
      return specialists.indexOf(specialist) === i;
    });

    uniqueSpecialists.forEach((specialist, i) => {
      this.pieChartDatasets[i] = {
        data: [],
        label: specialist,
        backgroundColor: '',
      };
      this.pieChartDatasets[i].data.push(0);
    });

    this.pieChartLabels = [];
    this.pieChartLabels.push('Turnos');

    uniqueSpecialists.forEach((appointment, index) => {
      for (let i = 0; i < filteredAppointments.length; i++) {
        if (
          appointment === filteredAppointments[i].specialist.firstName + ' ' + filteredAppointments[i].specialist.lastName
        ) {
          this.pieChartDatasets[index].data[0] += 1;
        }
        this.pieChartDatasets[index].backgroundColor = `rgba(${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )}, 1)`;
      }
    });
    this.chart?.update();
  }

  downloadAppointments() {
    const result: any = [];
    const specialists: string[] = [];
    const filteredAppointments = this.data.filter((filteredAppointment) => {
      return this.statisticsService.compareDates(
        filteredAppointment.schedule.day,
        filteredAppointment.schedule.month,
        this.day1,
        this.day2,
        this.month1,
        this.month2
      );
    });

    filteredAppointments.forEach((appointment) => {
      specialists.push(appointment.specialist.firstName + ' ' + appointment.specialist.lastName);
    });

    const uniqueSpecialists = specialists.filter((specialist, i) => {
      return specialists.indexOf(specialist) === i;
    });

    uniqueSpecialists.forEach((specialist, i) => {
      result[i] = { turnos: 0, specialist: specialist };
    });

    uniqueSpecialists.forEach((appointment, index) => {
      for (let i = 0; i < filteredAppointments.length; i++) {
        if (
          appointment === filteredAppointments[i].specialist.firstName + ' ' + filteredAppointments[i].specialist.lastName
        ) {
          result[index].turnos += 1;
        }
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'TURNOS');
    XLSX.writeFile(book, `Turnos solicitados por especialista entre ${this.day1}-${this.month1} y ${this.day2}-${this.month2}.xlsx`
    );
  }
}
