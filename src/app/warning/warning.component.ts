import { Input, Component } from '@angular/core';
import { IAlert } from '../interfaces/allInterfaces';
import { CoreAlertsService } from '../core-module/servises/core.alerts.service';

@Component({
  selector: 'app-ngbd-alert-closeable',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css'],
})

export class WarningComponent {

  @Input()
  public alerts: Array<IAlert> = [];

  constructor(private alertsService: CoreAlertsService) {

    this.alertsService.errorEvent.subscribe(data => this.errorsListen(data));
    this.alertsService.warningEvent.subscribe(data => this.errorsListen(data));
    this.alertsService.successEvent.subscribe(data => this.errorsListen(data));
  }

  errorsListen(alert: IAlert): void {
    this.alerts.push(alert);
    switch (alert.type) {
      case 'success':
        setTimeout(() => this.closeAlert(alert), 3000);
        break;
      case 'warning':
        setTimeout(() => this.closeAlert(alert), 5000);
        break;
      case 'danger':
        setTimeout(() => this.closeAlert(alert), 7000);
        break;
    }
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}


