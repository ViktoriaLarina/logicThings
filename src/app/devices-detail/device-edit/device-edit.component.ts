import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {ICurrentNodeDevices, INodeModel} from '../../interfaces/allInterfaces';
import {StoreService} from '../../store/store.service';
import {CoreAbonentsService} from '../../core-module/servises/core.abonents.service';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.css']
})
export class DeviceEditComponent implements OnInit {
  currentNode: INodeModel;
  private nodeStr: string;
  private deviceStr: string;
  private deviceValuesStr: string;
  currentDevice: any;
  currentDeviceValues: any;
  additional: boolean;
  @Input() device: any;
  @Input() deviceValues: any;
  constructor(private store: StoreService, private abonentsService: CoreAbonentsService) {
    this.additional = false;
  }
  @Output() onCloseEditDevice = new EventEmitter<boolean>();

  ngOnInit() {
    this.nodeStr = JSON.stringify(this.store.currentNode);
    this.currentNode = JSON.parse(this.nodeStr);
    this.deviceStr = JSON.stringify(this.device);
    this.currentDevice = JSON.parse(this.deviceStr);
    this.deviceValuesStr = JSON.stringify(this.deviceValues);
    this.currentDeviceValues = JSON.parse(this.deviceValuesStr);
    this.currentDevice.device_type = this.currentDevice.device_type.toString();
    if (this.currentDeviceValues.deviceType !== this.currentDevice.device_type) {
      this.currentDeviceValues.deviceType = +this.currentDevice.device_type;
    }
  }
  save() {
    this.currentDevice.port = +this.currentDevice.port;
    this.currentDevice.device_type = +this.currentDevice.device_type;

    this.abonentsService.saveDevice(this.currentDevice,
      this.currentNode,
      this.store.findAndGetNode(this.currentNode.node_id));

    const devVals = this.deviceValueParse(this.currentDeviceValues, this.currentDevice);

    this.abonentsService.saveDeviceValue(this.currentDevice, this.currentNode, this.store.findAndGetNode(this.currentNode.node_id), devVals);
    this.close();
    this.store.disabledNodeTreeEvent.next(false);
  }
  close() {
    this.store.disabledNodeTreeEvent.next(false);
    this.onCloseEditDevice.emit(false);
  }
  deviceValueParse(rawVals, device) {
    const values = [];
    switch (rawVals.deviceType) {
      case 10 : {
        for (const key in rawVals) {
          if (rawVals.hasOwnProperty(key)) {
            if (rawVals[key].name) {
              const value = {
                device_value_id: rawVals[key].id,
                device_id: device.device_id,
                device_value_type: 0,
                device_value: rawVals[key].name
              };
              switch (key) {
                case 'loadCharacteristics':
                  value.device_value_type = 101;
                  break;
                case 'accuracyClass':
                  value.device_value_type = 102;
                  break;
                case 'energyType':
                  value.device_value_type = 103;
                  break;
                case 'phaseQuantity':
                  value.device_value_type = 104;
                  break;
                case 'transformationCoefficient':
                  value.device_value_type = 105;
                  break;
                case 'decimal':
                  value.device_value_type = 106;
                  break;
                case 'deploymentPlace':
                  value.device_value_type = 107;
                  break;
                case 'entranceQuantity':
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
}
