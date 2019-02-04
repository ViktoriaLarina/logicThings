import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {RoleModel, UserEditModel, UserModel, UserStateModel} from "../../models/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Pattern} from "../../utils/pattern";
import {Role, UserStatus} from "../../utils/all_enum";
import {StaticData} from "../../utils/staticData";
import {UsersServiceImpl} from "../../communication-module/real/users.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {

  userInfo: FormGroup;
  roleArray: RoleModel[];
  userStatusArray: UserStateModel[];
  userRole: Role;
  userStatus: UserStatus;
  isErrorShow: boolean;
  isDisabled: boolean;

  constructor(public dialogRef: MatDialogRef<UserEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserModel, private usersServiceImpl: UsersServiceImpl) {

    this.roleArray = StaticData.Role;
    this.userStatusArray = StaticData.UserStatus;

    this.userInfo = new FormGroup({
      login: new FormControl({ value:this.data.login, disabled: true}),
      first_name: new FormControl(this.data.first_name, [Validators.required, Validators.pattern(Pattern.NAME_VALIDATOR)]),
      father_name: new FormControl(this.data.father_name, [Validators.required, Validators.pattern(Pattern.NAME_VALIDATOR)]),
      last_name: new FormControl(this.data.last_name, [Validators.required, Validators.pattern(Pattern.NAME_VALIDATOR)]),
      email: new FormControl({ value: this.data.email,  disabled: true})
    });

    this.userRole = this.data.role;
    this.userStatus = this.data.status;

    if (this.userStatus === UserStatus.activated) {
      this.isDisabled = true;
    }

  }

  closeDialog(isSuccess = false) {
    this.dialogRef.close(isSuccess);
  }

  editUserInfo() {
    this.isErrorShow = false;

    for (const key in this.userInfo.controls) {
      const control = this.userInfo.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      if (!control.value || control.invalid) {
        this.isErrorShow = true;
      }
    }

    this.userInfo.updateValueAndValidity();
    if (!this.userInfo.valid) {
      return;
    }

    let dto = new UserEditModel();
    dto.first_name = this.userInfo.controls['first_name'].value;
    dto.father_name = this.userInfo.controls['father_name'].value;
    dto.last_name = this.userInfo.controls['last_name'].value;
    dto.role = this.userRole;
    dto.status = this.userStatus;

    this.usersServiceImpl.editUserInfo(dto, this.data.user_id).subscribe((data: any)=> {
      this.closeDialog(true);
    })

  }


}
