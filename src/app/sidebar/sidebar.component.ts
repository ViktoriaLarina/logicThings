import { Component, ViewChild } from '@angular/core';
import { CoreAbonentsService } from '../core-module/servises/core.abonents.service';
import { StoreService } from '../store/store.service';
import {  PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  address: string[];
  show: boolean;
  disabled: boolean;
  constructor(private abonentsService: CoreAbonentsService, private store: StoreService ) {
    this.address = [];
    this.show = true;
    this.disabled = false;
    this.store.disabledNodeTreeEvent.subscribe( val => this.disabled = val);
  }
  closeOrShow() {
    if (this.show) {
    } else {
      this.abonentsService.getNodes();
    }
    this.show = !this.show;
  }

  scrollSearchToTop(event) {
    this.directiveRef.scrollToTop(event, 300);
  }
}
