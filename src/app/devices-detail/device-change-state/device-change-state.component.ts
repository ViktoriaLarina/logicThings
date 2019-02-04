import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';

import {ICurrentNodeDevices, INodeModel} from '../../interfaces/allInterfaces';
import {StoreService} from '../../store/store.service';
import {CoreAbonentsService} from '../../core-module/servises/core.abonents.service';
import {DeviceStateModel} from "../../models/DeviceState.model";
import {StaticData} from '../../utils/staticData';
import {DeviceState} from '../../utils/DeviceStates';


@Component({
  selector: 'app-device-change-state',
  templateUrl: './device-change-state.component.html',
  styleUrls: ['./device-change-state.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: StaticData.MY_FORMAT},
  ],
})
export class DeviceChangeStateComponent implements OnInit {

  @Input() deviceArr: Array<ICurrentNodeDevices>;
  @Input() device: ICurrentNodeDevices;

  ONE_YEAR = 1;
  DeviceState = DeviceState;
  isInvalidTime: boolean;
  stateArray: DeviceStateModel[];
  currentNode: INodeModel;
  private nodeStr: string;
  private deviceStr: string;
  minDateforDatepicker:Date;
  currentDevice: ICurrentNodeDevices;
  newDeviceState: any;
  ableSave: {
    state: boolean,
    date: boolean,
    childDev: boolean
  };

  newDateForReplace: {
    date: any,
    hour: string,
    minutes: string
  };
  currentDateAndTime: boolean;
  currentValue: string;

  childDevice: string;
  ableReplaceDevices: Array<ICurrentNodeDevices>;

  constructor(private store: StoreService, private abonentsService: CoreAbonentsService) {

    this.minDateforDatepicker = new Date();
    this.minDateforDatepicker.setFullYear(this.minDateforDatepicker.getFullYear() - this.ONE_YEAR);

    this.currentDateAndTime = false;

    this.newDeviceState = {
      device_state_id: '',
      device_id: '',
      comment: '',
      time: '',
      value: ''
    };
    this.ableSave = {
      state: false,
      date: false,
      childDev: false
    };
    this.newDateForReplace = {
      date: '',
      hour: '',
      minutes: ''
    };
  }

  hoursFormControl = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(2),
    Validators.min(0),
    Validators.max(23),
    Validators.pattern(/[0-9]{1,2}/),
  ]);
  minutesFormControl = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(2),
    Validators.min(0),
    Validators.max(59),
    Validators.pattern(/[0-9]{1,2}/),
  ]);
  @Output() onCloseChangeStateDevice = new EventEmitter<boolean>();

  ngOnInit() {
    this.nodeStr = JSON.stringify(this.store.currentNode);
    this.currentNode = JSON.parse(this.nodeStr);
    this.deviceStr = JSON.stringify(this.device);
    this.currentDevice = JSON.parse(this.deviceStr);
    this.currentValue = this.currentDevice.devState[this.currentDevice.devState.length - 1].value;

    if (this.currentValue === DeviceState.WORKED) {
      this.stateArray = StaticData.StateLabels.filter(item => item.state !== DeviceState.REPLACED);
    }
    this.stateArray = StaticData.StateLabels;


    this.newDeviceState.value = this.currentDevice.devState[this.currentDevice.devState.length - 1].value;
    this.ableReplaceDevices = this.getAbleReplaceDevices(this.deviceArr);
  }

  getAbleReplaceDevices(devices: Array<ICurrentNodeDevices>): Array<ICurrentNodeDevices> {
    return devices.filter(item =>
      item.device_id !== this.device.device_id &&
      item.device_type === this.device.device_type &&
      item.devState[item.devState.length - 1].value !== DeviceState.REPLACED);
  }

  setCurrentDate(isCurrentDateUse: boolean) {
    if (isCurrentDateUse) {
      this.newDateForReplace.date = moment();
      this.newDateForReplace.hour = moment().format('HH');
      this.newDateForReplace.minutes = moment().format('mm');
    }
  }

  save() {
    this.isInvalidTime = false;
    this.ableSave.state = false;
    this.ableSave.date = false;
    this.ableSave.childDev = false;

    if (!this.newDeviceState.value) {
      this.ableSave.state = true;
      return;
    }

    if (this.newDeviceState.value === DeviceState.REPLACED && !this.childDevice) {
      this.ableSave.childDev = true;
      return;
    }

    if (this.currentDateAndTime || (this.newDateForReplace.date && this.newDateForReplace.hour && this.newDateForReplace.minutes)) {

      if (this.hoursFormControl.invalid || this.minutesFormControl.invalid) {
        this.isInvalidTime = true;
        return;
      }

      this.newDeviceState.time = this.newDateForReplace.date
        .hours(+this.newDateForReplace.hour)
        .minutes(+this.newDateForReplace.minutes)
        .toISOString();
    } else {
      this.ableSave.date = true;
      return;
    }

    this.newDeviceState.device_id = this.currentDevice.device_id;
    this.currentDevice.child_id = this.childDevice;
    const stateArray = [this.newDeviceState];
    this.abonentsService.saveDevice(this.currentDevice, this.currentNode, this.store.findAndGetNode(this.currentNode.node_id));
    this.abonentsService.saveDeviceState(
      this.currentDevice,
      this.currentNode,
      this.store.findAndGetNode(this.currentNode.node_id),
      stateArray
    );
    this.close();
  }

  close() {
    this.store.disabledNodeTreeEvent.next(false);
    this.onCloseChangeStateDevice.emit(false);
  }
}
