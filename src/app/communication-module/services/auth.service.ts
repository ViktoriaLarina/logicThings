import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IUserResponse, IUsersAuthData} from '../../interfaces/allInterfaces';

@Injectable()
export abstract class AuthService {
  abstract login(user: IUsersAuthData): Observable<Response>;
  abstract registration(user: IUsersAuthData): Observable<Response>;
  abstract logout(user: IUserResponse): Observable<Response>;
  abstract tokenRefresh(key: string): Observable<any>;
}
