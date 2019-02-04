import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {JwtHelper} from 'angular2-jwt';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {Observable} from 'rxjs/Observable';
import {CoreAuthService} from "./core.auth.service";
import {deleteDeviceAttentionFilters, deleteReportsFilters} from "../../utils/allFunction";

@Injectable()
export class HomeGuardService implements CanActivate {

  constructor(private router: Router, private localStorage: AsyncLocalStorage) {
  }

  jwtHelper: JwtHelper = new JwtHelper();

  canActivate(): Observable<boolean> {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe((apiKey) => {
        if (apiKey) {
          if (this.jwtHelper.isTokenExpired(apiKey)) {
            deleteDeviceAttentionFilters();
            deleteReportsFilters();
            this.router.navigate(['/login']);
            observer.next(false);
          } else {
            observer.next(true);
          }
        } else {
          deleteDeviceAttentionFilters();
          this.router.navigate(['/login']);
          observer.next(false);
        }
      });
    });
  }
}
