import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbonentsServiceImpl} from '../../communication-module/real/abonents.service';
import {
  DevicesAttentionResponse, DtoChangeState, NodeDevice,
  ProgressBarData
} from '../../models/devicesAttentionAll.model';
import {DeviceStateModel} from '../../models/DeviceState.model';
import {Progress} from '../../utils/all_enum';
import {DeviceState} from '../../utils/DeviceStates';
import {StaticData} from '../../utils/staticData';
import {StoreService} from "../../store/store.service";

@Component({
  selector: 'app-confirm-device-state',
  templateUrl: './confirm-device-state.component.html',
  styleUrls: ['./confirm-device-state.component.css']
})
export class ConfirmDeviceStateComponent implements OnInit {

  deviceTypes: string[];
  stateArray: DeviceStateModel[];
  isRequestinProgress: boolean;
  progressBarData: ProgressBarData;
  isDisabledButton: boolean;
  isShowError: boolean;
  userId: string;

  dataToSendConsumption = new FormGroup({
    consumption: new FormControl('', Validators.maxLength(256))
  });

  dataToSendDescription = new FormGroup({
    description: new FormControl('', Validators.maxLength(256))
  });

  constructor(public dialogRef: MatDialogRef<ConfirmDeviceStateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NodeDevice, private service: AbonentsServiceImpl, private store: StoreService) {
    const temp = this.store.getCurrentUser();
    this.userId = temp['user_id'];
    this.deviceTypes = [];
    this.stateArray = [];
    StaticData.StateLabels.forEach((item) => this.stateArray[item.state] = item);
    this.progressBarData = StaticData.PROGRESS_BAR_VALUES
      .find((item: ProgressBarData) => item.progress === Progress.start);
  }

  ngOnInit() {
    console.log(this.data);

    StaticData.DEVICE_TYPES.forEach((item) => this.deviceTypes[item.device_type] = item.name);
    StaticData.StateLabels.forEach((item) => this.stateArray[item.state] = item);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmStatus() {
    this.isShowError = false;
    if (this.dataToSendConsumption.invalid || this.dataToSendDescription.invalid) {
      this.isShowError = true;
      return;
    }

    this.isDisabledButton = true;
    this.isRequestinProgress = true;
    this.progressBarData = StaticData.PROGRESS_BAR_VALUES
      .find((item: ProgressBarData) => item.progress === Progress.start);

    const dto = new DtoChangeState();
    dto.user_id = this.userId;
    dto.device_id = this.data.device_id;
    dto.comment = this.dataToSendDescription.controls['description'].value || '';
    dto.time = new Date().toISOString();
    dto.value = this.data.last_state === DeviceState.NOT_WORKED.toString() ? DeviceState.NOT_WORKED_CONFIRM : DeviceState.ABSENT_CONFIRM;

    if (!this.dataToSendConsumption.controls['consumption'].value) {

      this.service.changeDeviceState(dto, this.data.node_id).subscribe((data: any) => {
        this.progressBarData = StaticData.PROGRESS_BAR_VALUES
          .find((item: ProgressBarData) => item.progress === Progress.finish);
        setTimeout(() => this.dialogRef.close(true), 2000);
      }, (error) => {
        this.isDisabledButton = false;
        this.progressBarData = StaticData.PROGRESS_BAR_VALUES
          .find((item: ProgressBarData) => item.progress === Progress.firstError);
      });
    } else {
      this.service.changeDeviceState(dto, this.data.node_id).subscribe((data: any) => {
        this.progressBarData = StaticData.PROGRESS_BAR_VALUES
          .find((item: ProgressBarData) => item.progress === Progress.midle);
        this.changeFixedConsumption();
      }, (error) => {
        this.isDisabledButton = false;
        this.progressBarData = StaticData.PROGRESS_BAR_VALUES
          .find((item: ProgressBarData) => item.progress === Progress.firstError);
      });
    }
  }

  changeFixedConsumption() {
    const dtoChangeDeviceData = this.data;
    dtoChangeDeviceData.fixed_consumption = this.dataToSendConsumption.controls['consumption'].value;
    this.service.putNewDeviceData(dtoChangeDeviceData).subscribe((data: DevicesAttentionResponse) => {
      this.progressBarData = StaticData.PROGRESS_BAR_VALUES
        .find((item: ProgressBarData) => item.progress === Progress.finish);
      setTimeout(() => this.dialogRef.close(true), 1000);
    }, (error) => {
      this.isDisabledButton = false;
      this.progressBarData = StaticData.PROGRESS_BAR_VALUES
        .find((item: ProgressBarData) => item.progress === Progress.secondError);
    });
  }

}
