import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {Headers} from '@angular/http';
import {BASIC_PATH} from '../../constants';
import {IUserResponse, IUsersAuthData} from '../../interfaces/allInterfaces';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';
import {CoreAlertsService} from "../../core-module/servises/core.alerts.service";

@Injectable()
export class AuthServiceImpl {
  headers: any;

  constructor(private http: AuthHttp, private alertService: CoreAlertsService) {
    this.headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});
  }

  login(user: IUsersAuthData) {
    const body = JSON.stringify({login: user.login, password: user.password});
    const fullPath = BASIC_PATH + '/login';
    return this.http.post(fullPath, body, {headers: this.headers})
      .map(resp => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  registration(user: any) {
    const body = JSON.stringify(user);
    const fullPath = BASIC_PATH + '/register';
    return this.http.post(fullPath, body, {headers: this.headers})
      .map(resp => resp.json())
      .catch((error: any) => {
        this.alertService.errorAlert(error);
        return Observable.throw(error);
      });
  }

  logout(user: IUserResponse) {
    const fullPath = BASIC_PATH + '/logout';
    return this.http.post(fullPath, {}, {
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': user.api_key
      })
    })
      .map(resp => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  tokenRefresh(key) {
    const fullPath = BASIC_PATH + '/token';
    return this.http.get(fullPath, {
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .map(resp => resp.json())
      .catch((error: any) => Observable.throw(error));
  }
}
