import {Injectable} from '@angular/core';
import {AsyncLocalStorage} from 'angular-async-local-storage';

import {BASIC_PATH} from '../../constants';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserEditModel, UserModel} from "../../models/user.model";
import {QueryParamsModel} from "../../models/queryParams.model";

@Injectable()
export class UsersServiceImpl {
  headers: HttpHeaders;

  constructor(private http: HttpClient, private localStorage: AsyncLocalStorage) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'});
  }

  getUsers(data: QueryParamsModel, key: string) {
    const fullPath = `${BASIC_PATH}/users?page=${data.page}&perPage=${data.perPage}`;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .map(resp => resp)
      .catch((error: any) => Observable.throw(error));
  }

  deleteUser(id: string) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const fullPath = `${BASIC_PATH}/user/${id}`;
          return this.http.delete(fullPath, {
            headers: new HttpHeaders({
              'Content-Type': 'application/json;charset=utf-8',
              'X-API-KEY': key
            })
          })
            .catch((error: any) => Observable.throw(error))
            .subscribe((resp) => observer.next(resp));
        })
    });
  }

  editUserInfo(dto: UserModel | UserEditModel, id: string) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const fullPath = `${BASIC_PATH}/user/${id}`;
          return this.http.put(fullPath, dto, {
            headers: new HttpHeaders({
              'Content-Type': 'application/json;charset=utf-8',
              'X-API-KEY': key
            })
          })
            .catch((error: any) => Observable.throw(error))
            .subscribe((resp) => observer.next(resp));
        })
    });
  }

}
