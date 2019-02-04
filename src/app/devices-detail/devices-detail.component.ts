import {Component, OnDestroy, OnInit} from '@angular/core';

import {MatDialog} from '@angular/material';
import * as moment from 'moment';

import {CoreAbonentsService} from '../core-module/servises/core.abonents.service';
import {ICurrentNodeDevices} from '../interfaces/allInterfaces';
import {DeviceStateModel} from '../models/DeviceState.model';
import {StoreService} from '../store/store.service';
import {DeviceState} from '../utils/DeviceStates';
import {StaticData} from '../utils/staticData';
import {DeviceDeleteDialogComponent} from './device-confirm-delete/device-confirm-delete.component';
import {QrDialogComponent} from './qr-dialog/qr-dialog.component';

@Component({
  selector: 'app-devices-detail',
  templateUrl: './devices-detail.component.html',
  styleUrls: ['./devices-detail.component.css']
})
export class DevicesDetailComponent implements OnInit, OnDestroy {

  stateArray: DeviceStateModel[];
  DeviceState = DeviceState;

  devices: ICurrentNodeDevices[];
  management: {
    add: boolean,
    edit: boolean,
    changeState: boolean;
    replacementDevice: boolean;
  };
  currentDevice: any;
  currentNode: any;
  currentDeviceValues: any;
  qrString: string;

  constructor(public dialog: MatDialog, private store: StoreService, private abonentsService: CoreAbonentsService) {

    this.stateArray = [];
    StaticData.StateLabels.forEach((item) => this.stateArray[item.state] = item);

    this.store.currentNodeEvent.subscribe((node) => {
      this.currentNode = node;
    });
    this.store.currentDeviceValuesEvent.subscribe((devVals) => {
      this.currentDeviceValues = devVals;
    });
    this.store.deviceManagementEvent.subscribe((event) => {
      switch (event) {
        case 'add': {
          if (!this.management.edit && !this.management.changeState && !this.management.replacementDevice) {
            this.store.disabledNodeTreeEvent.next(true);
            this.management.add = true;
          }
        }
                    break;
        case 'edit': {
          if (!this.management.add && !this.management.changeState && !this.management.replacementDevice && this.currentDevice.device_id) {
            this.store.disabledNodeTreeEvent.next(true);
            this.management.edit = true;
          }
        }
                     break;
        case 'changeState': {
          if (!this.management.add && !this.management.edit && !this.management.replacementDevice && this.currentDevice.device_id) {
            this.store.disabledNodeTreeEvent.next(true);
            this.management.changeState = true;
          }
        }
                            break;
        case 'replacementDevice': {
          if (!this.management.add && !this.management.edit && !this.management.changeState && this.currentDevice.device_id) {
            this.store.disabledNodeTreeEvent.next(true);
            this.management.replacementDevice = true;
          }
        }
                                  break;
        case 'del': {
          if (this.currentDevice.device_id) {
            this.openDeletingDialog(this.currentDevice);
          }
        }
                    break;
      }
    });
    this.store.currentNodeDevicesEvent.subscribe((devs) => {
      this.devices = devs;
      this.currentDevice = {};
    });
    this.management = {
      add: false,
      edit: false,
      changeState: false,
      replacementDevice: false
    };
    this.devices = this.store.currentNodeDevices;
    this.currentDevice = {};
    this.qrString = '';
  }
  ngOnInit() {

    this.currentNode = this.store.currentNode;
    this.currentDeviceValues = this.store.currentDeviceValues;
    this.currentDevice = {};
  }
  ngOnDestroy() {
    this.currentNode = {};
    this.devices = [];
    this.currentDevice = {};
    this.management = {
      add: false,
      edit: false,
      changeState: false,
      replacementDevice: false
    };
    this.store.disabledNodeTreeEvent.next(false);
  }
  deleteDevice() {
    this.abonentsService.deleteDevice(this.currentDevice, this.currentNode, this.store.findAndGetNode(this.currentNode.node_id));
  }
  getAva(item) {
    switch (item.device_type) {
      case 10: return '../../assets/img/device-energy-3f51b5-bg.png';
      case 20: return '../../assets/img/device-water-3f51b5-bg.png';
      case 30: return '../../assets/img/device-water-3f51b5-bg.png';
      case 40: return '../../assets/img/device-gas-3f51b5-bg.png';
      case 50: return '../../assets/img/device-heating-3f51b5-bg.png';
    }
  }
  chooseDevice(item) {
    if (item.device_id !== this.currentDevice.device_id) {
      if (this.management.edit || this.management.changeState || this.management.replacementDevice) {
        this.store.disabledNodeTreeEvent.next(false);
        this.management.edit = false;
        this.management.changeState = false;
        this.management.replacementDevice = false;
      }
      this.currentDevice = item;
      this.abonentsService.getDeviceValues(item, this.currentNode);
    }
  }
  onCloseDevice(val) {
    this.management.add = val;
  }
  onCloseEditDevice(val) {
    this.management.edit = val;
  }
  onCloseChangeStateDevice(val) {
    this.management.changeState = val;
  }
  onCloseReplacementDevice(val) {
    this.management.replacementDevice = val;
  }
  changeState(item, $event) {
    $event.stopPropagation();
    this.currentDevice = item;
    this.store.deviceManagementEvent.next('changeState');
  }
  replacementDevice(item, $event) {
    $event.stopPropagation();
    this.currentDevice = item;
    this.store.deviceManagementEvent.next('replacementDevice');
  }
  getReplacementDate(item) {
    return moment(item.devState[item.devState.length - 1].time).format('DD.MM.YYYY HH:mm');
  }
  getChildSerial(item) {
    let done = false;
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].device_id === item.child_id) {
        done = true;
        return this.devices[i].serial_number;
      }
    }
    if (!done) {
      return 'Устройство не найдено';
    }
  }

  openDialog(item): void {
    this.qrString = `{"node_id":"${this.currentNode.node_id}","device_id":"${item.device_id}"}`;
    const dialogRef = this.dialog.open(QrDialogComponent, {
      data: { item, qrString: this.qrString, node : this.currentNode }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  private openDeletingDialog(device): void {
    const dialogRef = this.dialog.open(DeviceDeleteDialogComponent, {
      data: { deviceName: device.name, deviceSerialNumber: device.serial_number }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.deleteDevice();
      }
    });
  }
}
