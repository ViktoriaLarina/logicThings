import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoreAlertsService } from '../core-module/servises/core.alerts.service';
import { CoreAuthService } from '../core-module/servises/core.auth.service';
import {deleteDeviceAttentionFilters, deleteReportsFilters} from '../utils/allFunction';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  login: string;
  password: string;

  constructor(private httpService: CoreAuthService, private alertService: CoreAlertsService, private router: Router) {
    this.login = '';
    this.password = '';
  }

  getLogin() {
    const userData = {login: this.login, password: this.password};
    this.httpService.login(userData).subscribe((data) => {
      if (data) {
        deleteDeviceAttentionFilters();
        deleteReportsFilters();
        const message = 'Вы успешно вошли в систему!';
        this.alertService.successAlert(message);
        this.router.navigate(['/home']);
      }
    }, (error) => {
      this.alertService.errorAlert(error);
    });
  }
}
