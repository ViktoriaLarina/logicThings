import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AsyncLocalStorage} from "angular-async-local-storage";
import {Role} from "./all_enum";
import {Observable} from "rxjs/Observable";


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private localStorage: AsyncLocalStorage) {
  }

  canActivate(): Observable<boolean> {
    return new Observable(observer => {
      this.localStorage.getItem('ROLE').subscribe((role: string) => {
        if (role === Role.global_admin) {
          observer.next(true);
        } else {
          this.router.navigate(['/home']);
          observer.next(false);
        }

      });
    });
  }
}
