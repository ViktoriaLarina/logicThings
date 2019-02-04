import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export abstract class UsersService {
  abstract getUsers(data: any, key: string): Observable<any>;
}
