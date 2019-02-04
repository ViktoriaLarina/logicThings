import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {AbonentsServiceImpl} from '../../communication-module/real/abonents.service';
import {DevicesAttention, NodeDevice, QueryForAttentionDevicesRequest} from '../../models/devicesAttentionAll.model';
import {DeviceStateModel} from '../../models/DeviceState.model';
import {DeviceState} from '../../utils/DeviceStates';
import {StaticData} from '../../utils/staticData';
import {ConfirmDeviceStateComponent} from '../confirm-device-state/confirm-device-state.component';
import {ConfirmDeviceStateNewComponent} from '../confirm-device-state-new/confirm-device-state-new.component';

@Component({
  selector: 'app-device-attention-table',
  templateUrl: './device-attention-table.component.html',
  styleUrls: ['./device-attention-table.component.css']
})
export class DeviceAttentionTableComponent implements OnInit, OnDestroy {

  responseForTableDevices: DevicesAttention;
  arrayOfData: NodeDevice[];
  itemsCount: number;
  pageIndex: number;
  itemsPerPage: number;
  pageSizeOptions: number[];
  deviceTypes: string[];
  dto: QueryForAttentionDevicesRequest;
  subscribe: Subscription;
  subscribe2: Subscription;
  stateArray: DeviceStateModel[];
  isShowPaginator: boolean;

  constructor(private service: AbonentsServiceImpl, public dialog: MatDialog) {
    this.subscribe2 = this.service.devicesForTable.subscribe((data: DevicesAttention) => {
      if (!data) return;
      this.responseForTableDevices = data;
      this.arrayOfData = this.responseForTableDevices.node_devices || [];
      this.itemsCount = this.responseForTableDevices.total;
      this.isShowPaginator = Boolean(StaticData.ITEMS_PER_PAGE[0] < this.itemsCount);
    });

    this.deviceTypes = [];
    StaticData.DEVICE_TYPES.forEach((item) => this.deviceTypes[item.device_type] = item.name);
    this.stateArray = [];
    this.pageIndex = 0;
    this.itemsPerPage = StaticData.ITEMS_PER_PAGE[0];
    this.pageSizeOptions = StaticData.ITEMS_PER_PAGE;

    this.subscribe = this.service.queryForAttentionDevicesReq.subscribe((data: QueryForAttentionDevicesRequest) => {
      this.dto = data;
    });

  }

  ngOnInit() {
    StaticData.StateLabels.forEach((item) => this.stateArray[item.state] = item);
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
    this.subscribe2.unsubscribe();
  }

  setPage(e) {
    this.itemsPerPage !== e.pageSize ? this.pageIndex = 0 : this.pageIndex = e.pageIndex;

    this.itemsPerPage = e.pageSize;
    this.service.getAttentionDevices(this.dto, this.pageIndex, this.itemsPerPage).subscribe((data: DevicesAttention) => {
      this.service.devicesForTable.next(data);
    });
  }

  openModalWindow(device) {
    if (device.last_state === DeviceState.NOT_WORKED || device.last_state === DeviceState.ABSENT) {
      const dialogRef = this.dialog.open(ConfirmDeviceStateComponent, {
        disableClose: false,
        data: device
      } as MatDialogConfig);
      this.doAfterClosed(dialogRef);
    } else if (device.last_state === DeviceState.NEW) {
      console.log(device);
      this.service.getParentNode(device.node_id, device.parent_id).subscribe((data: any) => {
        const devices: NodeDevice[] = [device, data.devices[0]];
        const dialogRef = this.dialog.open(ConfirmDeviceStateNewComponent, {
          disableClose: false,
          data: devices
        } as MatDialogConfig);
        this.doAfterClosed(dialogRef);
      });
    }
  }

  doAfterClosed(dialogRef) {
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.service.getAttentionDevices(this.dto, this.pageIndex, this.itemsPerPage).subscribe((response: DevicesAttention) => {
          this.service.devicesForTable.next(response);
        });
      }
    });
  }

}
