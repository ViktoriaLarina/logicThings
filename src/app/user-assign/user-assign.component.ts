import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { StoreService } from '../store/store.service';
import { CoreAbonentsService } from '../core-module/servises/core.abonents.service';
import { AssignDeleteDialogComponent } from './confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.css'],
})
export class UserAssignComponent implements OnInit, OnDestroy {
  accessRights: any;
  addingUserAssign: boolean;
  currentNode: any;
  currentUser: any;
  dataForUpdateAssign: any;
  updatingUserAssign: boolean;
  users: any;

  constructor(public dialog: MatDialog, private store: StoreService, private abonentsService: CoreAbonentsService) {
    this.store.currentNodeEvent.subscribe((node) => {
      this.currentNode = node;
      this.setClearDataForUpdate();
      this.resetInitialProps();
      this.getAssignedUsers();
      // console.log('this.addingUserAssign');
      // console.log(this.addingUserAssign);
      // console.log('this.updatingUserAssign');
      // console.log(this.updatingUserAssign);
    });
    this.store.assignManagementEvent.subscribe((event) => {
      switch (event) {
        case 'add': {
          if (!this.updatingUserAssign && !this.addingUserAssign) {
            this.store.disabledNodeTreeEvent.next(true);
            this.addingUserAssign = true;
          }
        }
          break;
        case 'del': {
          if (this.currentUser.user_id && !this.updatingUserAssign && !this.addingUserAssign) {
            // this.deleteAssign();
            this.openDialog(this.currentUser);
          }
        }
          break;
      }
    });
    // this.currentUser = {};
    this.currentNode = this.store.currentNode;
    // this.addingUserAssign = false;
    // this.updatingUserAssign = false;
    // this.dataForUpdateAssign = {
    //   node_id: '',
    //   user_id: '',
    //   user_access_id: '',
    //   access_mask: null,
    //   device_type_mask: 0
    // };
    this.accessRights = [
      {
        value: 0,
        text: 'Только текущий узел и приборы на нем'
      },
      {
        value: 1,
        text: 'Текущий узел, все дочерние узлы и связанные приборы'
      }
    ];
  }

  ngOnInit() {
    // this.currentNode = this.store.currentNode;
    this.getAssignedUsers();
    this.setClearDataForUpdate();
    this.resetInitialProps();
    // console.log(this.currentUser);
  }

  ngOnDestroy() {
    this.currentNode = {};
    this.setClearDataForUpdate();
    this.resetInitialProps();
    this.store.disabledNodeTreeEvent.next(false);
  }

  cancelAccessChanges() {
    // console.log('cancelAccessChanges()');
    this.updatingUserAssign = false;
    this.currentUser = {};
    this.setClearDataForUpdate();
  }

  changeAccess(item, $event) {
    // console.dir('changeAccess');
    // console.dir(item);
    $event.stopPropagation();
    this.updatingUserAssign = true;
    this.currentUser = JSON.parse(JSON.stringify(item));
    this.dataForUpdateAssign.node_id = this.currentNode.node_id;
    this.dataForUpdateAssign.user_id = item.user_id;
    this.dataForUpdateAssign.user_access_id = item.user_access_id;
    // console.dir(this.dataForUpdateAssign);
  }

  chooseUser(user: any) {
    if (user.user_id !== this.currentUser.user_id) {
      if (!this.updatingUserAssign && !this.addingUserAssign) {
        this.store.disabledNodeTreeEvent.next(false);
        this.currentUser = JSON.parse(JSON.stringify(user));
      }
    }
    // console.dir(this.currentUser);
  }

  onCloseAddAssign(event: any) {
    // console.log(event);
    if (event.value) {
      this.addingUserAssign = false;
    }
    if (event.newAssignSaved) {
      this.getAssignedUsers();
    }
  }

  openDialog(user): void {
    const dialogRef = this.dialog.open(AssignDeleteDialogComponent, {
      width: '60%',
      data: { userLogin: user.user_login, currentNode: this.currentNode.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteAssign();
      }
    });
  }

  saveAccessChanges() {
    // console.dir('user assign comp saveAccessChanges()');
    // console.dir(this.dataForUpdateAssign);
    // this.abonentsService.changeUserAssigningAccess(this.dataForUpdateAssign);
    this.abonentsService.changeUserAssigningAccess(this.dataForUpdateAssign).subscribe(
      success => {
        // console.dir(success);
        this.cancelAccessChanges();
        this.getAssignedUsers();
      },
      error => {
        console.dir(error);
      },
    );
  }

  private deleteAssign() {
    // console.dir('user assign comp deleteAssign()');
    // console.dir(this.currentUser);
    const dataForDeleteAssign = {
      node_id: this.currentNode.node_id,
      user_id: this.currentUser.user_id,
      user_access_id: this.currentUser.user_access_id,
      access_mask: this.currentUser.access_mask,
      device_type_mask: 0
    };
    // console.dir(dataForDeleteAssign);
    // this.abonentsService.deleteUserAssigning(dataForDeleteAssign);
    this.abonentsService.deleteUserAssigning(dataForDeleteAssign).subscribe(
      success => {
        // console.dir(success);
        this.getAssignedUsers();
      },
      error => {
        console.dir(error);
      },
    );
  }

  private getAssignedUsers() {
    // console.dir('user assign comp getAssignedUsers()');
    // console.dir(this.currentNode);
    if (this.currentNode.node_id) {
      this.abonentsService.getAssignedUsers(this.currentNode.node_id).subscribe(
        success => {
          // console.dir(success);
          this.users = success;
        },
        error => {
          console.dir(error);
        },
      );
    }
  }

  private setClearDataForUpdate() {
    this.dataForUpdateAssign = {
      node_id: '',
      user_id: '',
      user_access_id: '',
      access_mask: null,
      device_type_mask: 0
    };
  }
  private resetInitialProps() {
    this.currentUser = {};
    this.addingUserAssign = false;
    this.updatingUserAssign = false;
  }
}
