import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs/Observable';
import {usersStore} from '../store/user.store';
import {IUsersAuthData} from '../../interfaces/allInterfaces';

// extends AuthService

export class AuthServiceImpl  {

  login(user: IUsersAuthData): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.userExist(user)) {
        observer.next(true);
      }else {
        observer.next(false);
      }
      observer.complete();
    });
  }
  logout(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  registration(user: IUsersAuthData): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.userExist(user)) {
        observer.next(false);
        alert('user exist');
      }else {
        usersStore.users[usersStore.users.length] = user;
        observer.next(true);
      }
      observer.complete();
    });
  }
  userExist(user: IUsersAuthData): boolean {
    let flag = false;
    usersStore.users.forEach((item) => {
      if (item.login === user.login) {
        flag = true;
      }
    });
    return flag;
  }
}
