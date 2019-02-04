import {NgModule} from '@angular/core';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import {CoreAuthService} from './servises/core.auth.service';
import {CoreAbonentsService} from './servises/core.abonents.service';
import {CoreUsersService} from './servises/core.users.service';
import {CoreAlertsService} from './servises/core.alerts.service';
import {CommunicationModule} from '../communication-module/communication.module';

@NgModule(
  {
    declarations: [],
    providers: [
      CoreAuthService,
      CoreAbonentsService,
      CoreAlertsService,
      CoreUsersService,

    ],
    imports: [AsyncLocalStorageModule, CommunicationModule]
  }
)
export class CoreModule {
}
