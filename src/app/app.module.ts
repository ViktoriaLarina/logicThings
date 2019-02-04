import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { Routes, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatButtonModule,
  MatTabsModule,
  MatCardModule,
  MatPaginatorModule,
  MatPaginatorIntl,
  MatExpansionModule,
  MatCheckboxModule,
  MatDialogModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatIconModule
} from '@angular/material';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { DpDatePickerModule } from 'ng2-date-picker';
import { HttpInterceptor, HttpInterceptorModule } from 'angular2-http-interceptor';
import { QRCodeModule } from 'angular2-qrcode';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { CoreModule } from './core-module/core.module';
import { CreAuthModule } from './core-module/core.auth.module';

import { StoreService } from './store/store.service';
import { AuthGuardSevice } from './core-module/servises/auth-guard.sevice';
import { HomeGuardService } from './core-module/servises/home-guard.service';
import { InterceptorService } from './core-module/servises/interceptor-service';
import { CoreAlertsService } from './core-module/servises/core.alerts.service';

import { toKiloUnitsPipe } from './pipes/toKiloUnits';
import { deviceTypesNamesPipe } from './pipes/deviceTypesNames';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
import { ForInDirective } from './directives/forIn.directive';
import { CustomPaginator } from './reports/customPaginator/customPaginator';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DevicesComponent } from './devices/devices.component';
import { DeviceReadingsComponent } from './device-readings/device-readings.component';
import { DeviceManagementComponent } from './devices-detail/device-management/device-management.component';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { AddressAdditionComponent } from './address-addition/address-addition.component';
import { UserAssignComponent } from './user-assign/user-assign.component';
import { ContentComponent } from './content/content.component';
import { ClientsNodesComponent } from './clients-nodes/clientsNodes.component';
import { WarningComponent } from './warning/warning.component';
import { RefComponent } from './token-refresh/token-refresh.component';
import { AddUserAssignComponent } from './user-assign/add-user-assign/add-user-assign.component';
import { ChartComponent } from './device-readings/chart/chart.component';
import { DevicesDetailComponent } from './devices-detail/devices-detail.component';
import { MapComponent } from './map/map.component';
import { DeviceEditComponent } from './devices-detail/device-edit/device-edit.component';
import { ReportsComponent } from './reports/reports.component';
import { DeviceAdditionalDataVersionComponent } from './devices-detail/device-additional-data-versions/device-additional-data-versions.component';
import { DeviceChangeStateComponent } from './devices-detail/device-change-state/device-change-state.component';
import { QrDialogComponent } from './devices-detail/qr-dialog/qr-dialog.component';
import { PhotoDialogComponent } from './device-readings/photo-dialog/photo-dialog.component';
import { ReportsManagementComponent } from './reports/reports-management/reports-management.component';
import { AssignDeleteDialogComponent } from './user-assign/confirm-delete/confirm-delete.component';
import { AddressDeleteDialogComponent } from './dashboard/address-confirm-delete/address-confirm-delete.component';
import { DeviceDeleteDialogComponent } from './devices-detail/device-confirm-delete/device-confirm-delete.component';
import { ReadingsDeleteDialogComponent } from './device-readings/readings-confirm-delete/readings-confirm-delete.component';
import { UsersComponent } from './users/users.component';
import { UserConfirmDeleteComponent } from './users/user-confirm-delete/user-confirm-delete.component';
import {UsersServiceImpl} from "./communication-module/real/users.service";
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { SpinnerComponent } from './users/spinner/spinner.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import {AuthServiceImpl} from './communication-module/real/auth.service';
import {RoleGuard} from "./utils/role-guard.service";
import {DeviceAttentionComponent} from './device-attention/device-attention.component';
import {AbonentsServiceImpl} from "./communication-module/real/abonents.service";
import { DeviceAttentionTableComponent } from './device-attention/device-attention-table/device-attention-table.component';
import { ConfirmDeviceStateComponent } from './device-attention/confirm-device-state/confirm-device-state.component';
import { ConfirmDeviceStateNewComponent } from './device-attention/confirm-device-state-new/confirm-device-state-new.component';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {SelectPipe} from "./pipes/selectPipe";
import {StatusPipe} from "./pipes/statusPipe";
import {MomentModule} from "ngx-moment";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const devicesRoutes: Routes = [
  { path: 'subscribers', component: DevicesComponent },
  { path: 'devices', component: DevicesDetailComponent },
  { path: 'user-assign', component: UserAssignComponent, canActivate: [RoleGuard] },
  { path: 'users', component: UsersComponent, canActivate: [RoleGuard] },
  { path: 'reports', component: ReportsComponent },
  { path: 'map', component: MapComponent },
  { path: 'device-attention', component: DeviceAttentionComponent, canActivate: [RoleGuard] },
  {path: '', pathMatch: 'full', redirectTo: 'subscribers'}
];

const appRoutes: Routes = [
  { path: 'login', component: LoginFormComponent, canActivate: [AuthGuardSevice]},
  { path: 'registration', component: RegisterFormComponent},
  { path: 'home', component: HomeComponent, canActivate: [HomeGuardService], children: devicesRoutes},
  { path: 'ref', component: RefComponent},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    toKiloUnitsPipe,
    deviceTypesNamesPipe,
    SelectPipe,
    StatusPipe,
    ForInDirective,
    InfiniteScrollDirective,
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    FooterComponent,
    HeaderComponent,
    ContentComponent,
    HomeComponent,
    SidebarComponent,
    DashboardComponent,
    ClientsNodesComponent,
    WarningComponent,
    DevicesComponent,
    DeviceReadingsComponent,
    DeviceManagementComponent,
    AddressEditComponent,
    AddressAdditionComponent,
    RefComponent,
    ChartComponent,
    RefComponent,
    DevicesDetailComponent,
    MapComponent,
    DeviceEditComponent,
    ReportsComponent,
    DeviceAdditionalDataVersionComponent,
    DeviceChangeStateComponent,
    QrDialogComponent,
    PhotoDialogComponent,
    ReportsManagementComponent,
    InfiniteScrollDirective,
    UserAssignComponent,
    AddUserAssignComponent,
    AssignDeleteDialogComponent,
    AddressDeleteDialogComponent,
    DeviceDeleteDialogComponent,
    ReadingsDeleteDialogComponent,
    UsersComponent,
    UserConfirmDeleteComponent,
    UserEditComponent,
    SpinnerComponent,
    AddUserComponent,
    DeviceAttentionComponent,
    DeviceAttentionTableComponent,
    ConfirmDeviceStateComponent,
    ConfirmDeviceStateNewComponent
  ],
  imports: [
    HttpInterceptorModule.withInterceptors(      [{
      provide: HttpInterceptor,
      useClass: InterceptorService,
      multi: true
    }]),
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDOuu4SE7BYQ3IM8Hd3C3L-eJVX7zg4ZwA'
    }),
    HttpClientModule,
    CoreModule,
    CreAuthModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    Angular2FontawesomeModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressBarModule,
    QRCodeModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MomentModule
  ],
  entryComponents: [
    QrDialogComponent,
    PhotoDialogComponent,
    AssignDeleteDialogComponent,
    AddressDeleteDialogComponent,
    DeviceDeleteDialogComponent,
    ReadingsDeleteDialogComponent,
    UserConfirmDeleteComponent,
    UserEditComponent,
    ConfirmDeviceStateComponent,
    ConfirmDeviceStateNewComponent
  ],
  providers: [
    AbonentsServiceImpl,
    CoreAlertsService,
    StoreService,
    UsersServiceImpl,
    AuthGuardSevice,
    HomeGuardService,
    RoleGuard,
    AuthServiceImpl,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'ru'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    { provide: MatPaginatorIntl, useClass: CustomPaginator},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: OwlDateTimeIntl, useValue: {
      setBtnLabel: 'Сохранить',
      cancelBtnLabel: 'Отменить'
    }
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private static matButton: any;
}
