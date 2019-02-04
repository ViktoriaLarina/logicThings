import { INodeModel } from './../interfaces/allInterfaces';
import {Component, OnInit, OnChanges, AfterViewChecked, OnDestroy} from '@angular/core';
import {ICurrentNodeDevices} from '../interfaces/allInterfaces';
import {StoreService} from '../store/store.service';
import {DeviceState} from "../utils/DeviceStates";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export class DevicesComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {

  DeviceState = DeviceState;

  devices: Array<any>;
  node: INodeModel;
  rendDevices: Array<ICurrentNodeDevices>;
  tabs: any;
  activeTab: any;
  currentWidth: {};
  currentParam: {};
  management: {
    device: boolean,
    address: boolean,
    addressAddition: boolean,
    addressEdit: boolean,
  };
  widthChecked: boolean;

  constructor(private store: StoreService) {
    this.store.addressManagementEvent.subscribe((event) => {
      switch (event) {
        case 'add': {
          if (!this.management.addressEdit) {
            this.store.disabledNodeTreeEvent.next(true);
            this.management.addressAddition = true;
          }
        }
          break;
        case 'edit': {
          if (!this.management.addressAddition) {
            this.store.disabledNodeTreeEvent.next(true);
            this.management.addressEdit = true;
          }
        }
          break;
        case 'close': {
          this.store.disabledNodeTreeEvent.next(false);
          this.management.addressEdit = false;
          this.management.addressAddition = false;
        }
          break;
      }
    });
    this.store.currentNodeDevicesEvent.subscribe((devs) => {
      this.devices = devs;
      this.rendDevices = devs;
      this.infoReload(devs[0]);
      this.checkingTabs(devs);
      this.reFreshTabs();
    });
    this.devices = [
    ];
    this.rendDevices = [];

    this.tabs = {
      tabAll: {
        name: 'Все приборы',
        exist: false,
        device_type: 'all',
      },
      tab10: {
        name: 'Электричество',
        device_type: 10,
        exist: false,
      },
      tab20: {
        name: 'Вода холодная',
        device_type: 20,
        exist: false,
      },
      tab30: {
        name: 'Вода горячая',
        device_type: 30,
        exist: false,
      },
      tab40: {
        name: 'Газ',
        device_type: 40,
        exist: false,
      },
      tab50: {
        name: 'Тепло',
        device_type: 50,
        exist: false,
      },
    };

    this.currentWidth = {};
    this.management = {
      device: false,
      address: false,
      addressAddition: false,
      addressEdit: false,
    };
    this.widthChecked = false;
  }
  ngOnInit() {
    this.currentWidth = {};
    this.devices = this.store.currentNodeDevices;
    this.rendDevices = this.devices;
    this.infoReload(this.devices[0]);
    this.checkingTabs(this.devices);
    this.reFreshTabs();

    this.store.currentNodeEvent.subscribe((cur) => {
      this.node = cur
    });
  }
  ngOnChanges() {
  }
  ngAfterViewChecked() {
    this.widthCheck();
  }
  pickIcon(device) {
    switch (device.device_type) {
      case 10: return 'energy-icon';
      case 20: return 'cold-water-icon';
      case 30: return 'hot-water-icon';
      case 40: return 'gas-icon';
      case 50: return 'heating-icon';
    }
  }
  checkingTabs(devices) {
    for (const key in this.tabs) {
      if (this.tabs.hasOwnProperty(key)) {
        this.tabs[key].exist = false;
      }
    }
    if (devices.length) {
      devices.forEach(
        (device) => {
          switch (device.device_type) {
            case 10: this.tabs.tab10.exist = true;
              break;
            case 20: this.tabs.tab20.exist = true;
              break;
            case 30: this.tabs.tab30.exist = true;
              break;
            case 40: this.tabs.tab40.exist = true;
              break;
            case 50: this.tabs.tab50.exist = true;
              break;
          }
        }
      );
    }
    if (this.checkForTabsQuantity(this.tabs)) {
      this.tabs.tabAll.exist = true;
    }
  }
  reFreshTabs() {
    this.activeTab = {};
    if (this.tabs.tabAll.exist) {
      this.setActiveTab(this.tabs.tabAll);
    } else {
      for (const key in this.tabs) {
        if (this.tabs.hasOwnProperty(key)) {
          if (this.tabs[key].exist) {
            this.setActiveTab(this.tabs[key]);
            return;
          }
        }
      }
    }
  }
  sortDevices(event) {
    if (event) {
      this.rendDevices = [];
      const tabName = event.tab.textLabel;
      if (tabName === this.tabs.tabAll.name) {
        this.rendDevices = this.devices;
      } else {
        let tabId;
        for (const key in this.tabs) {
          if (this.tabs.hasOwnProperty(key)) {
            if (this.tabs[key].name === tabName) {
              tabId = this.tabs[key].device_type;
            }
          }
        }
        this.devices.forEach(
          (device) => {
            if (device.device_type === tabId) {
              this.rendDevices.push(device);
            }
          }
        );
      }
    }
  }
  widthCheck() {
    const maxWidth = document.getElementById('dev-wrap').offsetWidth;
    const elCol = document.getElementsByClassName('devices-item');
    let trueWidth = 0;
    for (let i = 0; i < elCol.length; i++) {
      trueWidth += elCol.item(i).clientWidth;
    }
    if ((trueWidth + 5) < maxWidth) {
      this.currentWidth = {'width': maxWidth + 'px'};

      const elWidth = document.getElementById('devices-row');
      elWidth.style.width = maxWidth + 'px';
      const elScroll = document.getElementById('dev-wrap');
      elScroll.style.overflowX = 'hidden';
    } else {
      const elWidth = document.getElementById('devices-row');
      elWidth.style.width = trueWidth + 5 + 'px';
      const elScroll = document.getElementById('dev-wrap');
      elScroll.style.overflowX = 'scroll';
    }
  }
  infoReload(item) {
    if (item) {
      if (item.serial_number) {
        this.currentParam = item;
      }
    } else {
      this.currentParam = {};
    }
  }
  setActiveTab(tab) {
    this.activeTab = tab;
  }
  checkForTabsQuantity(tabs) {
    let counter = 0;
    for (const key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        if (tabs[key].exist === true) {
          counter++;
        }
      }
    }
    if (counter > 1) {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.currentWidth = {};
    this.devices = [];
    this.rendDevices = [];
    this.store.addressManagementEvent.next('close');
  }
}
