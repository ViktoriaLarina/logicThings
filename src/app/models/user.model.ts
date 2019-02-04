import {Role, UserStatus} from "../utils/all_enum";

export class userDto {
  public data: UserModel[];
  public operation_status: number;
  public page: number;
  public perPage: number;
  public total: number;
}

export class UserModel {
  public status: UserStatus;
  public role: Role;
  public email: string;
  public first_name: string;
  public last_name: string;
  public father_name: string;
  public login: string;
  public user_id?: string;
}

export class UserEditModel {
  public status: UserStatus;
  public role: Role;
  public first_name: string;
  public last_name: string;
  public father_name: string;
}

export class UserRegisterModel {
  public email: string;
  public first_name: string;
  public last_name: string;
  public father_name: string;
  public login: string;
  public password: string;
}

export class RoleModel {
  public value: Role;
  public text: string;
}

export class UserStateModel {
  public value: UserStatus;
  public text: string;
}
