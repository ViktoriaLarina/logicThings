import {DeviceState} from "../utils/DeviceStates";

export interface IAbonentsAddressModel {
  town_name?: string;
  street_name?: string;
  building_name?: string;
  entrance_id?: string;
}

export interface IFullAddressModel {
  clients: Array<{
    value: string;
    node_id: string;
    parent_id: string;
    node_type: number;
    description: string;
    buildings: Array<{
      value: string;
      node_id: string;
      parent_id: string;
      node_type: number;
      description: string;
      entrances: Array<{
        value: string;
        node_id: string;
        parent_id: string;
        node_type: number;
        description: string;
        flats: Array<{
          value: string;
          node_id: string;
          parent_id: string;
          node_type: number;
          description: string;
        }>,
        offices: Array<{
          value: string;
          node_id: string;
          parent_id: string;
          node_type: number;
          description: string;
        }>
      }>
    }>
  }>;
}

export interface INodeRequest {
  api_key?: string;
  nodeId?: string;
}

export interface INodeModels {
  node_id: string;
  parent_id?: string;
  node_type?: number;
  type_id?: number;
  name: string;
  description: string;
}

export interface IUsersStore {
  users: Array<{ login: string, password: string }>;
}

export interface IUsersAuthData {
  login: string;
  password: any;
  email?: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  id_client?: string;
  role?: string;
  state?: string;
}

export interface IUserResponse {
  api_key?: string;
  code?: number;
  used_id_client?: any;
}

export interface IAlert {
  type: string;
  message: string;
}

export interface INodeModel {
  node_id: string;
  parent_id?: string;
  node_type: number;
  name: string;
  description: string;
  child?: Array<INodeModel>;
}

export interface IUserDescription {
  firstName?: { name?: string, id?: string, node_id?: string };
  lastName?: { name?: string, id?: string, node_id?: string };
  patronymic?: { name?: string, id?: string, node_id?: string };
  country?: { name?: string, id?: string, node_id?: string };
  city?: { name?: string, id?: string, node_id?: string };
  // street?: {name?: string, id?: string, node_id?: string};
  houseNumber?: { name?: string, id?: string, node_id?: string };
  entranceNumber?: { name?: string, id?: string, node_id?: string };
  apartmentNumber?: { name?: string, id?: string, node_id?: string };
  officeNumber?: { name?: string, id?: string, node_id?: string };
  accountNumber?: { name?: string, id?: string, node_id?: string };
  district?: { name?: string, id?: string, node_id?: string };
  type?: { name?: string, id?: string, node_id?: string };
  name?: { name?: string, id?: string, node_id?: string };
  section?: { name?: string, id?: string, node_id?: string };
}

export interface ICurrentDeviceValues {
  deviceType: number;
  loadCharacteristics?: { name?: string, id?: string, device_id?: string };
  accuracyClass?: { name?: string, id?: string, device_id?: string };
  energyType?: { name?: string, id?: string, device_id?: string };
  phaseQuantity?: { name?: string, id?: string, device_id?: string };
  transformationCoefficient?: { name?: string, id?: string, device_id?: string };
  decimal?: { name?: string, id?: string, device_id?: string };
  deploymentPlace?: { name?: string, id?: string, device_id?: string };
  entranceQuantity?: { name?: string, id?: string, device_id?: string };
}

export interface ICurrentNodeDevices {
  device_id: string;
  device_type: number;
  name: string;
  description: string;
  serial_number: string;
  bill_number: string;
  app_eui: string;
  dev_eui: string;
  dev_addr: string;
  port: number;
  node_id: string;
  agreement_number: string;
  function: string;
  sector: string;
  service_company: string;
  owner_company: string;
  devState: State[];
  child_id: string;
  signs_amount: string;
  consumer_type: string;
}

export class State {
  public comment: string;
  public device_id: string;
  public device_state_id: string;
  public time: string;
  public value: DeviceState;
}

export interface ITabs {
  tab10?: boolean;
  tab20?: boolean;
  tab30?: boolean;
  tab40?: boolean;
  tab50?: boolean;
}

export interface IDeviceDataPeriod {
  date: any;
  periodType: string;
  startingDate: any;
  endingDate: any;
  typeDataRendering: string;
  placeholder: string;
  dateToShow: any;
  savedDate: any;
  periodChoosen: string;
  modalPeriod: boolean;
  periodChecked: boolean;
  yearChecked: boolean;
  mode: string;
}

export interface IDatePickerConfig {
  format?: string;
  drops?: string;
  disableKeypress?: boolean;
  firstDayOfWeek?: string;
  monthFormat?: string;
  yearFormat?: string;
  showMultipleYearsNavigation?: boolean;
  multipleYearsNavigateBy?: number;
  closeOnSelect?: boolean;
  locale?: string;
}

export interface IDeviceReadingsData {
  period: string;
  beginData: number;
  endData: number;
  consumption: number;
}

export interface ICriterion {
  name: string;
  value: string;
}

export interface IReportParameters {
  category: string;
  categoryData: string;
  categoryDevice: string;
  startingDate: any;
  endingDate: any;
  periodChecked: boolean;
}
