import {INodeModel, IUserDescription, ICurrentNodeDevices, ICurrentDeviceValues} from '../interfaces/allInterfaces';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {DeviceState} from "../utils/DeviceStates";
import {StaticData} from "../utils/staticData";

@Injectable()
export class StoreService {
  currentNode: INodeModel;
  currentNodeValues: IUserDescription;
  currentNodeDevices: Array<ICurrentNodeDevices>;
  currentDeviceValues: ICurrentDeviceValues;
  addresses: any;
  userEvent: Subject<any>;
  currentNodeEvent: Subject<any>;
  currentNodeDevicesEvent: Subject<any>;
  currentNodeValuesEvent: Subject<any>;
  currentDeviceValuesEvent: Subject<any>;
  deviceManagementEvent: Subject<any>;
  addressManagementEvent: Subject<any>;
  assignManagementEvent: Subject<any>;
  disabledNodeTreeEvent: Subject<any>;
  createReportEvent: Subject<any>;
  user: {};
  searchCollection: any;
  crrentPeriods = {};
  currentSearchFilters = {};
  constructor() {
    this.deviceManagementEvent = new Subject();
    this.addressManagementEvent = new Subject();
    this.assignManagementEvent = new Subject();
    this.userEvent = new Subject();
    this.currentNodeEvent = new Subject();
    this.currentNodeDevicesEvent = new Subject();
    this.currentNodeValuesEvent = new Subject();
    this.currentDeviceValuesEvent = new Subject();
    this.disabledNodeTreeEvent = new Subject();
    this.createReportEvent = new Subject();
    this.user = {};
    this.searchCollection = {};
    this.currentNode = {
      node_id: '',
      parent_id: '',
      node_type: 0,
      name: '',
      description: ''
    };

    this.currentNodeValues = {
      firstName: {name: '', id: '', node_id: ''},
      lastName: {name: '', id: '', node_id: ''},
      patronymic: {name: '', id: '', node_id: ''},
      country: {name: '', id: '', node_id: ''},
      city: {name: '', id: '', node_id: ''},
      houseNumber: {name: '', id: '', node_id: ''},
      entranceNumber: {name: '', id: '', node_id: ''},
      apartmentNumber: {name: '', id: '', node_id: ''},
      officeNumber: {name: '', id: '', node_id: ''},
      accountNumber: {name: '', id: '', node_id: ''},
      district: {name: '', id: '', node_id: ''},
      type: {name: '', id: '', node_id: ''},
      name: {name: '', id: '', node_id: ''},
      section: {name: '', id: '', node_id: ''},
    };

    this.currentDeviceValues = {
      deviceType: 0,
      loadCharacteristics: {name: '', id: '', device_id: ''},
      accuracyClass: {name: '', id: '', device_id: ''},
      energyType: {name: '', id: '', device_id: ''},
      phaseQuantity: {name: '', id: '', device_id: ''},
      transformationCoefficient: {name: '', id: '', device_id: ''},
      decimal: {name: '', id: '', device_id: ''},
      deploymentPlace: {name: '', id: '', device_id: ''},
      entranceQuantity: {name: '', id: '', device_id: ''},
    };

    this.currentNodeDevices = [
      {
        device_id: '',
        device_type: 0,
        name: '',
        description: '',
        serial_number: '',
        bill_number: '',
        app_eui: '',
        dev_eui: '',
        dev_addr: '',
        port: 0,
        node_id: '',
        agreement_number: '',
        function: '',
        sector: '',
        owner_company: '',
        service_company: '',
        signs_amount: '',
        consumer_type: '',
        devState: [{
          device_state_id: '',
          device_id: '',
          comment: '',
          time: '',
          value: DeviceState.NONE
        }],
        child_id: '',
      }
    ];


    this.addresses = {
      clients: [],
    };
  }

  getSearchParams(id) {
    return this.currentSearchFilters[id] ? this.currentSearchFilters[id] : {};
  }

  setSearchParams(id: any, params: any) {
    this.currentSearchFilters[id] = params;
  }

  setCurrentNode(node) {
    this.currentNodeEvent.next(node);
    this.currentNode = node;
  }
  setNodeValues(vals) {
    if (vals && vals.length > 0) {
      this.currentNodeValues = {
        firstName: {name: '', id: '', node_id: ''},
        lastName: {name: '', id: '', node_id: ''},
        patronymic: {name: '', id: '', node_id: ''},
        country: {name: '', id: '', node_id: ''},
        city: {name: '', id: '', node_id: ''},
        houseNumber: {name: '', id: '', node_id: ''},
        entranceNumber: {name: '', id: '', node_id: ''},
        apartmentNumber: {name: '', id: '', node_id: ''},
        officeNumber: {name: '', id: '', node_id: ''},
        accountNumber: {name: '', id: '', node_id: ''},
        district: {name: '', id: '', node_id: ''},
        type: {name: '', id: '', node_id: ''},
        name: {name: '', id: '', node_id: ''},
        section: {name: '', id: '', node_id: ''},
      };


      vals.forEach((item) => {
        const field = this.currentNodeValues[StaticData.Fields[item.value_type]];
        if(!field)
        {
          return;
        }

        field.node_id = item.node_id;
        field.name = item.value;
        field.id = item.value_id;
      });
      this.currentNodeValuesEvent.next(this.currentNodeValues);
    }
  }
  setCurrentPeriod(node_id, period) {
    this.crrentPeriods[node_id] = period;
  }
  getCurrentPeriod(node_id) {
    return this.crrentPeriods[node_id];
  }
  setRootNode(nodes) {
    this.addresses.clients = nodes;
  }
  getRootNode() {
    return this.addresses;
  }
  getCurrentUser() {
    return this.user;
  }
  setCurrentNodeDevices(devs) {
    this.currentNodeDevicesEvent.next(devs);
    this.currentNodeDevices = devs;
  }
  setDeviceValues(vals) {
    if (vals.length > 0) {
      switch (vals[0].device_value_type.toString()[0]) {
        case '1': {
          this.currentDeviceValues = {
            deviceType: 10,
            loadCharacteristics: {name: '', id: '', device_id: ''},
            accuracyClass: {name: '', id: '', device_id: ''},
            energyType: {name: '', id: '', device_id: ''},
            phaseQuantity: {name: '', id: '', device_id: ''},
            transformationCoefficient: {name: '', id: '', device_id: ''},
            decimal: {name: '', id: '', device_id: ''},
            deploymentPlace: {name: '', id: '', device_id: ''},
            entranceQuantity: {name: '', id: '', device_id: ''},
          };
          vals.forEach((item) => {
            switch (item.device_value_type) {
              case 101 : {
                this.currentDeviceValues.loadCharacteristics.device_id = item.device_id;
                this.currentDeviceValues.loadCharacteristics.name = item.device_value;
                this.currentDeviceValues.loadCharacteristics.id = item.device_value_id;
              }
                break;
              case 102 : {
                this.currentDeviceValues.accuracyClass.device_id = item.device_id;
                this.currentDeviceValues.accuracyClass.name = item.device_value;
                this.currentDeviceValues.accuracyClass.id = item.device_value_id;
              }
                break;
              case 103 : {
                this.currentDeviceValues.energyType.device_id = item.device_id;
                this.currentDeviceValues.energyType.name = item.device_value;
                this.currentDeviceValues.energyType.id = item.device_value_id;
              }
                break;
              case 104 : {
                this.currentDeviceValues.phaseQuantity.device_id = item.device_id;
                this.currentDeviceValues.phaseQuantity.name = item.device_value;
                this.currentDeviceValues.phaseQuantity.id = item.device_value_id;
              }
                break;
              case 105 : {
                this.currentDeviceValues.transformationCoefficient.device_id = item.device_id;
                this.currentDeviceValues.transformationCoefficient.name = item.device_value;
                this.currentDeviceValues.transformationCoefficient.id = item.device_value_id;
              }
                break;
              case 106 : {
                this.currentDeviceValues.decimal.device_id = item.device_id;
                this.currentDeviceValues.decimal.name = item.device_value;
                this.currentDeviceValues.decimal.id = item.device_value_id;
              }
                break;
              case 107 : {
                this.currentDeviceValues.deploymentPlace.device_id = item.device_id;
                this.currentDeviceValues.deploymentPlace.name = item.device_value;
                this.currentDeviceValues.deploymentPlace.id = item.device_value_id;
              }
                break;
              case 108 : {
                this.currentDeviceValues.entranceQuantity.device_id = item.device_id;
                this.currentDeviceValues.entranceQuantity.name = item.device_value;
                this.currentDeviceValues.entranceQuantity.id = item.device_value_id;
              }
                break;
            }
          });
        }
          break;
      }
      this.currentDeviceValuesEvent.next(this.currentDeviceValues);
    }
  }
  setUser(user) {
    this.userEvent.next(user);
    this.user = user;
  }

  findAndGetNode (id) {
    let currNode = {node_id: ''};
    if (id !== '') {
      this.addresses.clients.forEach((uk) => {
        if (uk.node_id === id) {
          currNode = uk;
        } else {
          if (uk.child) {
            uk.child.forEach((house) => {
              if (house.node_id === id) {
                currNode = house;
              } else {
                if (house.child) {
                  house.child.forEach((ofice) => {
                    if (ofice.node_id === id) {
                      currNode = ofice;
                    } else {
                      if (ofice.child) {
                        ofice.child.forEach((apart) => {
                          if (apart.node_id === id) {
                            currNode = ofice;
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
    return currNode;
  }
  delCurrentNodeChild() {
    delete this.currentNode.child;
  }
  cleanStore() {
    this.currentNode = {
      node_id: '',
      parent_id: '',
      node_type: 0,
      name: '',
      description: ''
    };
    this.currentNodeValues = {
      firstName: {name: '', id: '', node_id: ''},
      lastName: {name: '', id: '', node_id: ''},
      patronymic: {name: '', id: '', node_id: ''},
      country: {name: '', id: '', node_id: ''},
      city: {name: '', id: '', node_id: ''},
      houseNumber: {name: '', id: '', node_id: ''},
      entranceNumber: {name: '', id: '', node_id: ''},
      apartmentNumber: {name: '', id: '', node_id: ''},
      officeNumber: {name: '', id: '', node_id: ''},
      accountNumber: {name: '', id: '', node_id: ''},
      district: {name: '', id: '', node_id: ''},
      type: {name: '', id: '', node_id: ''},
      name: {name: '', id: '', node_id: ''},
      section: {name: '', id: '', node_id: ''},
    };
    this.currentNodeDevices = [];

    this.currentNodeEvent.next(this.currentNode);
    this.currentNodeValuesEvent.next(this.currentNodeValues);
    this.currentNodeDevicesEvent.next(this.currentNodeDevices);
  }
}
