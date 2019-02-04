export class DtoStatistics {
  public management_company: string;
  public district: string;
  public sector: string;
  public device_type: number;
  public startingDate: any;
  public endingDate: any;
}

export class StatisticsResponse {
  public operation_status: number;
  public message: string;

  public devices_absent: number;
  public devices_absent_confirm: number;
  public devices_new: number;
  public devices_not_worked: number;
  public devices_not_worked_confirm: number;
  public devices_replaced: number;
  public devices_total: number;
  public devices_worked: number;
  public samples_ready: number;
}
