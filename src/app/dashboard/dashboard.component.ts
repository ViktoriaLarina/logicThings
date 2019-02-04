import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { StoreService } from '../store/store.service';
import { INodeModel, IUserDescription } from '../interfaces/allInterfaces';
import { CoreAbonentsService } from '../core-module/servises/core.abonents.service';
import { AddressDeleteDialogComponent } from './address-confirm-delete/address-confirm-delete.component';
import {StaticData} from "../utils/staticData";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {



  currentNode: INodeModel;
  currentNodeValues: IUserDescription;
  constructor(private dialog: MatDialog,
              private store: StoreService,
              private abonentsService: CoreAbonentsService,
              public router: Router) {


    this.currentNodeValues = this.store.currentNodeValues;
    this.currentNode = this.store.currentNode;

    this.store.currentNodeEvent.subscribe((cur) => this.currentNode = cur);
    this.store.currentNodeValuesEvent.subscribe((val) => this.currentNodeValues = val);
  }
  addressAdd() {
    if (this.router.url === '/home/subscribers') {
      this.store.addressManagementEvent.next('add');
      this.store.disabledNodeTreeEvent.next(true);
    } else if (this.router.url === '/home/devices') {
      this.store.deviceManagementEvent.next('add');
    } else if (this.router.url === '/home/user-assign') {
      this.store.assignManagementEvent.next('add');
    }
  }
  addressChange() {
    if (this.router.url === '/home/subscribers') {
      this.store.addressManagementEvent.next('edit');
      this.store.disabledNodeTreeEvent.next(true);
    } else if (this.router.url === '/home/devices') {
      this.store.deviceManagementEvent.next('edit');
    // } else if (this.router.url === '/home/user-assign') {
    //   this.store.assignManagementEvent.next('edit');
    }
  }
  addressDel() {
    if (this.router.url === '/home/subscribers') {
      this.openDialog(this.currentNode);
      // this.abonentsService.deleteNode(this.currentNode, this.store.findAndGetNode(this.currentNode.parent_id));
    } else if (this.router.url === '/home/devices') {
      this.store.deviceManagementEvent.next('del');
    } else if (this.router.url === '/home/user-assign') {
      this.store.assignManagementEvent.next('del');
    }
  }
  closeMenu() {
    const panel = document.getElementById('sideNav');
    const shadow = document.getElementById('dashboard-shadow');
    shadow.className = 'shadow closed-up';
    panel.className = 'sidebar-wrapper';
  }

  private openDialog(node): void {
    const dialogRef = this.dialog.open(AddressDeleteDialogComponent, {
      width: '60%',
      data: { nodeName: node.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.abonentsService.deleteNode(this.currentNode, this.store.findAndGetNode(this.currentNode.parent_id));
      }
    });
  }

}
