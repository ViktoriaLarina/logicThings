import {Injectable} from '@angular/core';
import {UsersService} from '../../communication-module/services/users.service';
import {Observable} from 'rxjs/Observable';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {StoreService} from '../../store/store.service';
import 'rxjs/add/operator/switchMap';
import {Subject} from "rxjs/Subject";


@Injectable()
export class CoreUsersService {

  isLoadingShow = new Subject<boolean>();
  isFormAddUserShow = new Subject<boolean>();
  isNeedGetUser = new Subject<boolean>();

  constructor(private usersService: UsersService,
              private store: StoreService,
              private localStorage: AsyncLocalStorage) {
  }

  getUsersList(data) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.usersService.getUsers(data, key).subscribe(
            (success) => {
              observer.next(success);
            }, (err: any) => observer.error(err));

        });
    });
  }
}
