export class Schedule {
  day: number;
  month: number;
  hour: number;
  minute: number;

  constructor(day: number, month: number, hour: number, minute: number) {
    this.day = day;
    this.month = month;
    this.hour = hour;
    this.minute = minute;
  }
}
