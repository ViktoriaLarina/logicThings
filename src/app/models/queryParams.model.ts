import {Role, UserStatus} from "../utils/all_enum";

export class QueryParamsModel {
  public page: number;
  public perPage: number;
  public search?: string;
  public role?: Role;
  public status?: UserStatus
}
