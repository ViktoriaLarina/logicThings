
// import {Request, Response} from '@angular/http';
// import {Injectable} from '@angular/core';
// import {IHttpInterceptor} from 'angular2-http-interceptor';
//
// import { Router } from '@angular/router';
// import {JwtHelper} from 'angular2-jwt';
// import {AsyncLocalStorage} from 'angular-async-local-storage';
// import {Observable} from 'rxjs/Observable';
//
//
// @Injectable()
// export class InterceptorService implements IHttpInterceptor {
//   constructor(private localStorage: AsyncLocalStorage, private router: Router) {
//   }
//   jwtHelper: JwtHelper = new JwtHelper();
//   before(request: Request): Request | Observable<Request> {
//     if (request.url === '/api/v2/login' || request.url === '/api/v2/register' || request.url === '/api/v2/token') {
//       return request;
//     } else {
//       return this.localStorage.getItem('API_KEY')
//         .map((apiKey) => {
//           const curDate: any = new Date();
//           const expDate: any = this.jwtHelper.getTokenExpirationDate(apiKey);
//           const difInMin: any = (expDate - curDate) / 1000 / 60;
//           if (difInMin <= 0) {
//             this.router.navigate(['/login']);
//           } else {
//             return request;
//           }
//           return request;
//
//
//         // if (this.jwtHelper.getTokenExpirationDate(token)) {}
//       });
//     }
//     // return request;
//   }
//
// }

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {JwtHelper} from 'angular2-jwt';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private localStorage: AsyncLocalStorage, private router: Router) {

  }
  jwtHelper: JwtHelper = new JwtHelper();
  intercept (request: HttpRequest<any>, next: HttpHandler): any {
    if (request.url === '/api/v2/login' || request.url === '/api/v2/register' || request.url === '/api/v2/token') {
      return next.handle(request);
    } else {
      return this.localStorage.getItem('API_KEY')
        .flatMap((apiKey) => {
          const curDate: any = new Date();
          const expDate: any = this.jwtHelper.getTokenExpirationDate(apiKey);
          const difInMin: any = (expDate - curDate) / 1000 / 60;
          if (difInMin <= 0) {
            this.router.navigate(['/login']);
          }
          return next.handle(request);
      });
    }
  }
}
