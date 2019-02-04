import {
  ColorProgressBar, CommentValue, Progress, ProgressNew, SampleFlag, SortField, SortFild,
  SortType
} from '../utils/all_enum';
import {DeviceState} from '../utils/DeviceStates';

export class DevicesAttentionResponse {
  public message?: string;
  public data: string[];
  public operation_status: number;
}

export class DevicesAttention {
  public node_devices: NodeDevice[];
  public operation_status: number;
  public page: number;
  public perPage: number;
  public sort_field: SortFild;
  public sort_type: SortType;
  public total: number;
}

export class NodeDevice {
  public device_id: string;
  public device_type: number;
  public name: string;
  public description: string;
  public serial_number: string;
  public bill_number: string;
  public app_eui: string;
  public dev_eui: string;
  public dev_addr: string;
  public port: number;
  public node_id: string;
  public agreement_number: string;
  public sector: string;
  public owner_company: string;
  public service_company: string;
  public child_id: string;
  public last_state: string;
  public last_state_time: string;
  public last_data_time: string;
  public signs_amount: string;
  public consumer_type: string;
  public fixed_consumption: string;
  public parent_id: string;
  public user_data: string;
  public node_type: number;
  public management_company: string;
  public location_district: string;
  public location_type: string;
  public location_name: string;
  public location_number: string;
  public location_section: string;
  public location_entrance: string;
  public location_flat_number: string;
  public location_office_number: string;
  public user_info: string;
}

export class QueryForAttentionDevicesRequest {
  public company: string;
  public district: string;
  public sector: string;
  public deviceType: number;
  public sortType: SortType;
  public sortField: SortField;
  public state: DeviceState;
}

export class SortParam {
  public sortType: SortType;
  public sortField: SortField;
  public text: string;
}

export class DtoChangeState {
  public device_state_id?: string;
  public device_id: string;
  public comment: string;
  public time: string;
  public user_id: string;
  public value: DeviceState;
}

export class ProgressBarData {
  public value: number;
  public text: string;
  public color: ColorProgressBar;
  public progress: Progress | ProgressNew;
}

export class DtoSampleOldDevice {
  public sample_id: string;
  public sample_type: number;
  public sample_time: string;
  public value: string;
  public user_id: string;
  public comment: string;
  public comment_value: CommentValue;
  public sample_flag: SampleFlag;
  public sample_flag_comment: string;
  public proposal_device_state: DeviceState;
  public node_id: string;
  public device_id: string;
}
