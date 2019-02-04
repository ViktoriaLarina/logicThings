import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {ICurrentDeviceValues, ICurrentNodeDevices, INodeModel} from '../../interfaces/allInterfaces';
import {StoreService} from '../../store/store.service';
import {CoreAbonentsService} from '../../core-module/servises/core.abonents.service';
import * as moment from 'moment';
import {DeviceStateModel} from "../../models/DeviceState.model";
import {StaticData} from "../../utils/staticData";

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css'],
})
export class DeviceManagementComponent implements OnInit {

  stateOnInitArray: DeviceStateModel[];

  currentNode: INodeModel;
  private nodeStr: string;
  newDevice: ICurrentNodeDevices;
  newDeviceValue: ICurrentDeviceValues;
  additional: boolean;
  newDeviceValueParsed: any;
  newDeviceState: any;
  constructor(private store: StoreService, private abonentsService: CoreAbonentsService) {
    this.stateOnInitArray = StaticData.StateLabels.filter(item => item.canSetOnInit);
    this.newDevice = {
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
      service_company: '',
      owner_company: '',
      devState: [],
      child_id: '',
      signs_amount: '',
      consumer_type: ''
    };
    this.newDeviceState = {
      device_state_id: '',
      device_id: '',
      comment: '',
      time: '',
      value: ''
    };
    this.newDeviceValue = {
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
    this.additional = false;
    this.newDeviceValueParsed = {};
  }
  @Output() onCloseDevice = new EventEmitter<boolean>();
  ngOnInit() {
    this.nodeStr = JSON.stringify(this.store.currentNode);
    this.currentNode = JSON.parse(this.nodeStr);
  }
  create() {
    this.newDevice.port = +this.newDevice.port;
    this.newDevice.device_type = +this.newDevice.device_type;
    this.abonentsService.createDevice(this.newDevice,
      this.currentNode,
      this.store.findAndGetNode(this.currentNode.node_id))
      .subscribe(success => {
        this.abonentsService.createDeviceValue(success,
          this.currentNode,
          this.store.findAndGetNode(this.currentNode.node_id),
          this.deviceValueParse(this.newDeviceValue, success));
        this.abonentsService.saveDeviceState(success,
          this.currentNode,
          this.store.findAndGetNode(this.currentNode.node_id),
          this.deviceStateParse(this.newDeviceState, success));
    });

    this.close();
    this.store.disabledNodeTreeEvent.next(false);
  }
  close() {
    this.store.disabledNodeTreeEvent.next(false);
    this.onCloseDevice.emit(false);
  }
  typeSelect($event) {
    this.newDeviceValue.deviceType = +$event.value;
  }
  deviceValueParse(rawVals, device) {
    const values = [];
    switch (this.newDevice.device_type) {
      case 10 : {
        for (const key in rawVals) {
          if (rawVals.hasOwnProperty(key)) {
            if (key !== 'deviceType') {
              const value = {
                device_value_id: '',
                device_id: device.device_id,
                device_value_type: 0,
                device_value: rawVals[key].name
              };
              switch (key) {
                case 'loadCharacteristics':
                  value.device_value_type = 101;
                  break;
                case 'accuracyClass' :
                  value.device_value_type = 102;
                  break;
                case 'energyType' :
                  value.device_value_type = 103;
                  break;
                case 'phaseQuantity' :
                  value.device_value_type = 104;
                  break;
                case 'transformationCoefficient' :
                  value.device_value_type = 105;
                  break;
                case 'decimal' :
                  value.device_value_type = 106;
                  break;
                case 'deploymentPlace' :
                  value.device_value_type = 107;
                  break;
                case 'entranceQuantity' :
                  value.device_value_type = 108;
                  break;
              }
              values.push(value);
            }
          }
        }
      }
        break;
    }
    return values;
  }
  deviceStateParse(state, device) {
    const newState = [];
    state.device_id = device.device_id;
    state.time = moment().toISOString();
    newState.push(state);
    return newState;
  }
}
