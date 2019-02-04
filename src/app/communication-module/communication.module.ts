import {NgModule} from '@angular/core';
import {AuthService} from './services/auth.service';
import {AuthServiceImpl} from './real/auth.service';
import {AbonentsService} from './services/abonents.service';
import {AbonentsServiceImpl} from './real/abonents.service';
import {UsersService} from './services/users.service';
import {UsersServiceImpl} from './real/users.service';

@NgModule(
  {
    declarations: [],
    providers: [
      {provide: AuthService, useClass: AuthServiceImpl},
      {provide: AbonentsService, useClass: AbonentsServiceImpl},
      {provide: UsersService, useClass: UsersServiceImpl}]
  }
)
export class CommunicationModule {
}
