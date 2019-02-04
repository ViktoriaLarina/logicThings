import {Injectable} from '@angular/core';
import {AuthService} from '../../communication-module/services/auth.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {IUsersAuthData, IUserResponse} from '../../interfaces/allInterfaces';
import {JwtHelper} from 'angular2-jwt';
import {deleteDeviceAttentionFilters, deleteReportsFilters} from "../../utils/allFunction";

@Injectable()
export class CoreAuthService implements CanActivate {
  constructor(private authService: AuthService,
              private localStorage: AsyncLocalStorage) {
  }

  jwtHelper: JwtHelper = new JwtHelper();

  login(user: IUsersAuthData) {
    const loginWaiter = new Observable(observer => {
      this.authService.login(user)
        .subscribe((success) => {
          if (success) {
            const userData: any = success;
            this.localStorage.setItem('userId', this.jwtHelper.decodeToken(userData.api_key).user_id)
              .subscribe(() => {
                this.localStorage.setItem('API_KEY', userData.api_key)
                  .subscribe((da) => {
                    this.localStorage.setItem('ROLE', this.jwtHelper.decodeToken(userData.api_key).role).subscribe((data) => {
                      observer.next(true);
                    })
                  });
              });
          }
        }, (err: any) => observer.error(err));
    });
    return loginWaiter;
  }

  registration(user: IUsersAuthData) {
    const loginWaiter = new Observable<boolean>((observer) => {
      this.authService.registration(user)
        .subscribe((success) => {
          if (success) {
            observer.next(true);
          }
        });
    });
    return loginWaiter;
  }

  logout() {
    const loginWaiter = new Observable<boolean>(observer => {
      this.localStorage.getItem('API_KEY').subscribe((apiKey) => {
          const req: IUserResponse = {api_key: apiKey};
          this.authService.logout(req)
            .subscribe((success) => {
              if (success) {
                deleteDeviceAttentionFilters();
                deleteReportsFilters();
                this.localStorage.removeItem('userId')
                  .subscribe(() => {
                    this.localStorage.removeItem('API_KEY')
                      .subscribe(() => {
                        observer.next(true);
                        this.localStorage.removeItem('ROLE')
                          .subscribe(() => {
                            observer.next(true);
                          });
                      });
                  });
              }
            }, (err: any) => {
              this.localStorage.removeItem('userId')
                .subscribe(() => {
                  this.localStorage.removeItem('API_KEY')
                    .subscribe(() => {
                      return observer.error(err);
                    });
                });
            });
        }
      );
    });
    return loginWaiter;
  }

  tokenRefresh() {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.authService.tokenRefresh(key).subscribe(
            (success) => {
              const userData = success;
              this.localStorage.setItem('API_KEY', userData.api_key).subscribe((da) => {
                this.localStorage.setItem('ROLE', userData.role).subscribe((role) => {
                  observer.next(true);

                });
              });
            });
        });
    });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const activateChecker = new Observable<boolean>(observer => {

      this.localStorage.getItem('userId').subscribe((userId) => {
          if (userId) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        }
      );
    });
    return activateChecker;
  }
}
