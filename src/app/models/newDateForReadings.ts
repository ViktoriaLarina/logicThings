export class NewDateForReadings {
  date: any;
  hour: string;
  minutes: string;

  constructor(date: any = '',
              hour: string = '',
              minutes: string = '') {
    this.date = date;
    this.hour = hour;
    this.minutes = minutes;
  }
}
