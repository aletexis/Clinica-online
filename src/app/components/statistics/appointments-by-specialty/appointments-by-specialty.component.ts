import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/classes/appointment';
import { StatisticsService } from 'src/app/services/statistics.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-appointments-by-specialty',
  templateUrl: './appointments-by-specialty.component.html',
  styleUrls: ['./appointments-by-specialty.component.css'],
})
export class AppointmentsBySpecialtyComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public pieChartLabels: string[] = [];
  public pieChartDatasets: any[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  data: Appointment[] = [];
  unsub: Subscription = new Subscription();

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    this.unsub = this.statisticsService
      .getAppointmentBySpecialty('Doctor')
      .subscribe((data: Appointment[]) => {
        this.pieChartDatasets = [];
        this.pieChartLabels = [];
        this.data = data;

        const specialties: string[] = [];
        
        data.forEach((appointment) => {
          specialties.push(appointment.specialty.name);
        });

        const uniqueSpecialties = specialties.filter((specialty, i) => {
          return specialties.indexOf(specialty) === i;
        });

        uniqueSpecialties.forEach((specialty, i) => {
          this.pieChartDatasets[i] = {
            data: [],
            label: specialty,
            backgroundColor: '',
          };
          this.pieChartDatasets[i].data.push(0);
        });

        this.pieChartLabels.push('Turnos');

        uniqueSpecialties.forEach((appointment, index) => {
          for (let i = 0; i < data.length; i++) {
            if (appointment === data[i].specialty.name) {
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
    const specialties: string[] = [];
    
    this.data.forEach((appointment) => {
      specialties.push(appointment.specialty.name);
    });

    const uniqueSpecialties = specialties.filter((specialty, i) => {
      return specialties.indexOf(specialty) === i;
    });

    uniqueSpecialties.forEach((specialty, i) => {
      result[i] = { turnos: 0, specialty: specialty };
    });

    uniqueSpecialties.forEach((appointment, index) => {
      for (let i = 0; i < this.data.length; i++) {
        if (appointment === this.data[i].specialty.name) {
          result[index].turnos += 1;
        }
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'TURNOS');
    XLSX.writeFile(book, 'Turnos por especialidad.xlsx');
  }
}