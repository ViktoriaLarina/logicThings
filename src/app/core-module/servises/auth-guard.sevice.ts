import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import {JwtHelper} from 'angular2-jwt';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';

@Injectable()
export class AuthGuardSevice implements CanActivate {

  constructor(private router: Router, private localStorage: AsyncLocalStorage) {}
  jwtHelper: JwtHelper = new JwtHelper();
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable(observer => {
      this.localStorage.getItem('API_KEY').subscribe((apiKey) => {
        if (apiKey) {
          if (!this.jwtHelper.isTokenExpired(apiKey)) {
            this.router.navigate(['/home']);
            observer.next(false);
          } else {
            observer.next(true);
          }
        } else {
          observer.next(true);
        }
      });
    });
  }
}
