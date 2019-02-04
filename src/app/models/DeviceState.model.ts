import {DeviceState} from '../utils/DeviceStates';

export class DeviceStateModel {
  public state: DeviceState;
  public text: string;
  public canSetOnInit: boolean;
  public cssClass: string;
  public isForDeviceAttentionPage: boolean;
}

export class DeviceTypes {
  public name: string;
  public device_type: number;
}
