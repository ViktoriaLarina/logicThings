import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {CoreAuthService} from '../core-module/servises/core.auth.service';
import { CoreAlertsService } from '../core-module/servises/core.alerts.service';
import {RoleModel, UserRegisterModel, UserStateModel} from "../models/user.model";
import {Role, UserStatus} from "../utils/all_enum";
import {Pattern} from "../utils/pattern";
import {confirmPasswordValidator} from "../utils/confirmPasswordValidator";
import {StaticData} from "../utils/staticData";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-reg-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})

export class RegisterFormComponent {

  newUserInfo: FormGroup;
  roleArray: RoleModel[];
  userStatusArray: UserStateModel[];
  userRole: Role;
  userStatus: UserStatus;
  isErrorShow: boolean;

  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(Pattern.MIN_LENGTH_PASSWORD),
    Validators.pattern(Pattern.PASSWORD_VALIDATOR)
  ]);
  confirmPasswordControl = new FormControl('', [
    Validators.required,
    confirmPasswordValidator(this.passwordControl)
  ]);

  constructor(private authService: CoreAuthService, private alertService: CoreAlertsService, private router: Router) {

    this.passwordControl.valueChanges.subscribe((data: Observable<any>) => {
      this.confirmPasswordControl.updateValueAndValidity();
    });

    this.roleArray = StaticData.Role;
    this.userStatusArray = StaticData.UserStatus;

    this.userRole = Role.user;
    this.userStatus = UserStatus.not_activated;

    this.newUserInfo = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.pattern(Pattern.LOGIN_VALIDATOR)]),
      first_name: new FormControl('', [Validators.required, Validators.pattern(Pattern.NAME_VALIDATOR)]),
      father_name: new FormControl('', [Validators.required, Validators.pattern(Pattern.NAME_VALIDATOR)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern(Pattern.NAME_VALIDATOR)]),
      email: new FormControl('', [Validators.required, Validators.pattern(Pattern.EMAIL_VALIDATOR)]),
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl
    });

  }

  sendData() {
    this.isErrorShow = false;

    for (const key in this.newUserInfo.controls) {
      const control = this.newUserInfo.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      if (!control.value || control.invalid) {
        this.isErrorShow = true;
        setTimeout(() => this.isErrorShow = false, StaticData.TIME_INTERVAL);
      }
    }

    this.newUserInfo.updateValueAndValidity();
    if (!this.newUserInfo.valid) {
      return;
    }

    const dto = new UserRegisterModel();
    dto.login = this.newUserInfo.controls['login'].value;
    dto.first_name = this.newUserInfo.controls['first_name'].value;
    dto.father_name = this.newUserInfo.controls['father_name'].value;
    dto.last_name = this.newUserInfo.controls['last_name'].value;
    dto.email = this.newUserInfo.controls['email'].value;
    dto.password = this.newUserInfo.controls['password'].value;

    this.authService.registration(dto).subscribe( (data: any) => {
      this.newUserInfo.reset();
      this.router.navigate(['/login']);
    });

  }

}
