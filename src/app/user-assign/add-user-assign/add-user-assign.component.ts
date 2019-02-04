import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {StoreService} from '../../store/store.service';
import {CoreAbonentsService} from '../../core-module/servises/core.abonents.service';

@Component({
  selector: 'app-add-user-assign',
  templateUrl: './add-user-assign.component.html',
  styleUrls: ['./add-user-assign.component.css'],
})
export class AddUserAssignComponent implements OnInit, OnDestroy {
  @Input() assignedUsers: any;
  @Output() onCloseAddAssign = new EventEmitter<any>();
  accessRights: any;
  currentNode: any;
  // devices: any;
  newAssigning: any;
  users: any;

  constructor(private store: StoreService, private abonentsService: CoreAbonentsService) {
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
    this.store.currentNodeEvent.subscribe((node) => {
      this.currentNode = node;
    });
    this.currentNode = this.store.currentNode;
    this.newAssigning = {
      node_id: this.currentNode.node_id,
      user_id: '',
      user_access_id: '',
      access_mask: null,
      device_type_mask: 0
    };
  }

  ngOnInit() {
    // console.log('AddUserAssignComponent OnInit');
    this.getAllUsers();
    // console.dir(this.users);
  }

  ngOnDestroy() {
    // console.log('AddUserAssignComponent ngOnDestroy');
    this.currentNode = {};
    this.clearAssignForm();
    this.store.disabledNodeTreeEvent.next(false);
  }

  assignUser() {
    // console.dir('user add-assign comp assignUser()');
    // this.abonentsService.assignNewUser(this.newAssigning);
    // this.closeUserAssign({ newAssignSaved: true });
    this.abonentsService.assignNewUser(this.newAssigning).subscribe(
      success => {
        // console.dir(success);
        this.closeUserAssign({newAssignSaved: true});
      },
      error => {
        console.dir(error);
      },
    );
  }

  checkUser() {
    let userIsAssigned = false;
    // console.dir(this.assignedUsers);
    // console.dir(this.newAssigning);
    if (this.assignedUsers) {
      this.assignedUsers.forEach(user => {
        if (user.user_id === this.newAssigning.user_id) {
          userIsAssigned = true;
        }
      });
    }
    // console.dir(userIsAssigned);
    if (this.newAssigning.node_id && this.newAssigning.user_id
      && (this.newAssigning.access_mask === 0 || this.newAssigning.access_mask === 1)
      && this.newAssigning.device_type_mask === 0 && !userIsAssigned) {
      return true;
    } else {
      return false;
    }
  }

  closeUserAssign(savingResult?: any) {
    this.clearAssignForm();
    this.store.disabledNodeTreeEvent.next(false);
    if (savingResult && savingResult.newAssignSaved) {
      this.onCloseAddAssign.emit({ value: true, newAssignSaved: true });
    } else {
      this.onCloseAddAssign.emit({ value: true, newAssignSaved: false });
    }
  }

  private clearAssignForm() {
    this.newAssigning = {
      node_id: '',
      user_id: '',
      user_access_id: '',
      access_mask: null,
      device_type_mask: 0
    };
  }

  private getAllUsers() {
    // console.dir('user assign comp getAllUsers()');
    // console.dir(this.currentNode);
    this.abonentsService.getAllUsers().subscribe(
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
