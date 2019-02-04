import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {CoreAbonentsService} from '../core-module/servises/core.abonents.service';
import {CoreAuthService} from '../core-module/servises/core.auth.service';
import {StoreService} from '../store/store.service';
import {Role} from '../utils/all_enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  user: any;
  navLinks: any;

  constructor(private httpService: CoreAuthService,
              private httpAbonService: CoreAbonentsService,
              public router: Router,
              private localStorage: AsyncLocalStorage,
              private store: StoreService) {


    this.navLinks = [
      {path: 'subscribers', tooltip: 'Абоненты', iconClass: 'header-abonents-icon', isOnlyForGlobalAdmin: false},
      {path: 'devices', tooltip: 'Устройства', iconClass: 'header-devices-icon', isOnlyForGlobalAdmin: false},
      {
        path: 'user-assign',
        tooltip: 'Права пользователей',
        iconClass: 'header-assign-icon',
        isOnlyForGlobalAdmin: false
      },
      /*{path: 'map', tooltip: 'Карта', iconClass: 'header-map-icon', isOnlyForGlobalAdmin: false}, */
      {path: 'users', tooltip: 'Пользователи', iconClass: 'header-users-icon', isOnlyForGlobalAdmin: true},
      {path: 'reports', tooltip: 'Отчеты', iconClass: 'header-reports-icon', isOnlyForGlobalAdmin: false},
      {path: 'device-attention', tooltip: 'Устройства требующие внимание', iconClass: 'header-device-attention-icon', isOnlyForGlobalAdmin: true}
    ];

    this.checkRole();

    this.store.userEvent.subscribe((user) => {
      this.user = user;
    });
    this.user = {first_name: '', last_name: ''};
  }

  checkRole() {
    this.localStorage.getItem('ROLE').subscribe((role: string) => {
      if (role === Role.user.toString()) {
        this.navLinks = this.navLinks.filter((item: any) => item.isOnlyForGlobalAdmin === false);
      }
    });
  }

  ngOnInit() {
    this.httpAbonService.getUser();
  }

  getLogout($event) {
    $event.preventDefault();
    this.httpService.logout().subscribe(
      (data) => {
        if (data) {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );
  }

  expandAbonents() {
    const panel = document.getElementById('sideNav');
    const shadow = document.getElementById('dashboard-shadow');
    panel.className = 'sidebar-wrapper expanded-panel';
    shadow.className = 'shadow';
  }
}
