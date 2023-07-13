import { Component, OnInit } from '@angular/core';
import { StatisticsService, Login } from 'src/app/services/statistics.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.css'],
})
export class LoginHistoryComponent implements OnInit {

  loginHistory: Login[] = [];
  displayLogHistory: boolean = false;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.statisticsService.getLoginHistory().subscribe((data) => {
      this.loginHistory = data;
    });
  }

  downloadLoginHistory() {
    const data: any = [];
    this.loginHistory.forEach((login) => {
      data.push({
        user: login.user,
        datetime: login.datetime.toDate().toLocaleString(),
      });
    });
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'HistorialDeIngresos');
    XLSX.writeFile(book, 'HistorialDeIngresos.xlsx');
  }
}
