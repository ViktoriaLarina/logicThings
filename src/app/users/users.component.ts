import {Component, OnDestroy} from '@angular/core';

import {MatDialog} from '@angular/material';

import {Subscription} from 'rxjs/Subscription';
import {UsersServiceImpl} from '../communication-module/real/users.service';
import {CoreUsersService} from '../core-module/servises/core.users.service';
import {QueryParamsModel} from '../models/queryParams.model';
import {RoleModel, userDto, UserModel, UserStateModel} from '../models/user.model';
import {StaticData} from '../utils/staticData';
import {UserConfirmDeleteComponent} from './user-confirm-delete/user-confirm-delete.component';
import {UserEditComponent} from './user-edit/user-edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnDestroy {

  isFormAddUserShow: boolean;
  roleArray: RoleModel[];
  userStateArray: UserStateModel[];
  role: string;
  status: string;
  usersList: UserModel[];

  itemsCount: number;
  pageIndex: number;
  itemsPerPage: number;
  pageSizeOptions: number[];
  subscribe: Subscription;
  subscribe1: Subscription;

  constructor(private usersService: CoreUsersService, public dialog: MatDialog, private usersServiceImpl: UsersServiceImpl) {

    this.subscribe = this.usersService.isFormAddUserShow.subscribe((data: boolean) => {
      this.isFormAddUserShow = data;
    });

    this.subscribe1 = this.usersService.isNeedGetUser.subscribe((data: boolean) => {
      if (data) {
        this.getUsers(this.pageIndex, this.itemsPerPage);
      }
    });

    this.pageIndex = 0;
    this.itemsPerPage = StaticData.ITEMS_PER_PAGE[0];
    this.pageSizeOptions = StaticData.ITEMS_PER_PAGE;

    this.roleArray = [];
    StaticData.Role.forEach((item) => this.roleArray[item.value] = item.text);
    this.userStateArray = StaticData.UserStatus;
    StaticData.UserStatus.forEach((item) => this.userStateArray[item.value] = item.text);

    this.usersList = [];
    this.getUsers(this.pageIndex, this.itemsPerPage);
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
    this.subscribe1.unsubscribe();
    this.usersService.isLoadingShow.next(false);
  }

  setPage(e) {
    this.itemsPerPage !== e.pageSize ? this.pageIndex = 0 : this.pageIndex = e.pageIndex;

    this.itemsPerPage = e.pageSize;

    this.getUsers(this.pageIndex, this.itemsPerPage);
  }

  getUsers(page: number, perPage: number) {

    const queryParam = new QueryParamsModel();
    queryParam.page = page + 1;
    queryParam.perPage = perPage;
    this.usersService.isLoadingShow.next(true);

    this.usersService.getUsersList(queryParam)
      .subscribe((result: userDto) => {
        this.usersService.isNeedGetUser.next(false);
        this.usersService.isLoadingShow.next(false);
        this.usersList = result.data;
        this.itemsCount = result.total;
      }, (error) => {
        this.usersService.isLoadingShow.next(false);
      });

  }

  deleteUser(user: UserModel) {
    const dialogRef = this.dialog.open(UserConfirmDeleteComponent, {
      disableClose: false,
      data: user
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.usersServiceImpl.deleteUser(user.user_id).subscribe((response) => {
          this.getUsers(this.pageIndex, this.itemsPerPage);
        });
      }
    });
  }

  editUserInfo(user: UserModel) {
    const dialogRef = this.dialog.open(UserEditComponent, {
      disableClose: false,
      data: user
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.getUsers(this.pageIndex, this.itemsPerPage);
      }
    });
  }

  showAddUserForm() {
    this.usersService.isFormAddUserShow.next(true);
  }

}
