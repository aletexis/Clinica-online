import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Appointment } from 'src/app/classes/appointment';
import { StatisticsService } from 'src/app/services/statistics.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-appointments-per-day',
  templateUrl: './appointments-per-day.component.html',
  styleUrls: ['./appointments-per-day.component.css'],
})
export class AppointmentsPerDayComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public pieChartLabels: string[] = [];
  public pieChartDatasets: any[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  data: Appointment[] = [];

  constructor(private statisticsService: StatisticsService) { }


  ngOnInit() {
    this.statisticsService.getAppointmentsByDay('22', '10').subscribe((data: Appointment[]) => {
      this.pieChartDatasets = [];
      this.pieChartLabels = [];
      this.data = data;

      const days: string[] = [];
      data.forEach((appointment) => {
        days.push(appointment.schedule.day + '/' + appointment.schedule.month);
      });

      const uniqueDays = days.filter((d, i) => {
        return days.indexOf(d) === i;
      });

      uniqueDays.forEach((d, i) => {
        this.pieChartDatasets[i] = { data: [], label: d, backgroundColor: '' };
        this.pieChartDatasets[i].data.push(0);
      });

      this.pieChartLabels.push('Turnos');

      uniqueDays.forEach((appointment, index) => {
        for (let i = 0; i < data.length; i++) {
          if (appointment === data[i].schedule.day + '/' + data[i].schedule.month) {
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
    });
  }

  public pieChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  downloadAppointments() {
    const result: any = [];
    const days: string[] = [];

    this.data.forEach((appointment) => {
      days.push(appointment.schedule.day + '/' + appointment.schedule.month);
    });

    const uniqueDays = days.filter((day, i) => {
      return days.indexOf(day) === i;
    });

    uniqueDays.forEach((day, i) => {
      result[i] = { turnos: 0, day: day };
    });

    uniqueDays.forEach((appointment, index) => {
      for (let i = 0; i < this.data.length; i++) {
        if (
          appointment === this.data[i].schedule.day + '/' + this.data[i].schedule.month
        ) {
          result[index].turnos += 1;
        }
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Turnos');
    XLSX.writeFile(book, 'Turnos por dia.xlsx');
  }
}