import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbonentsServiceImpl} from '../../communication-module/real/abonents.service';
import {
  DtoChangeState, DtoSampleOldDevice, NodeDevice,
  ProgressBarData
} from '../../models/devicesAttentionAll.model';
import {DeviceStateModel} from '../../models/DeviceState.model';
import {StoreService} from '../../store/store.service';
import {CommentValue, ProgressNew, SampleFlag} from '../../utils/all_enum';
import {DeviceState} from '../../utils/DeviceStates';
import {StaticData} from '../../utils/staticData';

@Component({
  selector: 'app-confirm-device-state-new',
  templateUrl: './confirm-device-state-new.component.html',
  styleUrls: ['./confirm-device-state-new.component.css']
})
export class ConfirmDeviceStateNewComponent implements OnInit {

  userId: string;
  oldDevice: NodeDevice;
  newDevice: NodeDevice;
  deviceTypes: string[];
  stateArray: DeviceStateModel[];
  isRequestinProgress: boolean;
  progressBarData: ProgressBarData;
  progressBarDataArray: ProgressBarData[];
  isDisabledButton: boolean;
  isShowError: boolean;
  isEmptyFields: boolean;

  dataToSendDescription = new FormGroup({
    description: new FormControl('', Validators.maxLength(256))
  });

  newDeviceData = new FormGroup({
    sector: new FormControl(),
    serialNumber: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
    signsAmount: new FormControl(),
    consumerType: new FormControl()
  });

  newDeviceDataindications = new FormGroup({
    valueIndications: new FormControl(),
    dateTime: new FormControl()
  });

  oldDeviceDataindications = new FormGroup({
    valueIndications: new FormControl(),
    dateTime: new FormControl()
  });

  static validateControls(controls: { [key: string]: AbstractControl; }) {
    let error = false;
    for (const key in controls) {
      const control = controls[key];
      control.markAsTouched();
      control.markAsDirty();
      if (!control.value || control.invalid) {
        error = true;
      }
    }
    return error;
  }

  constructor(public dialogRef: MatDialogRef<ConfirmDeviceStateNewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NodeDevice[], private service: AbonentsServiceImpl, private store: StoreService) {
    const temp = this.store.getCurrentUser();
    this.userId = temp['user_id'];
    this.newDevice = this.data[0];
    this.oldDevice = this.data[1];
    this.deviceTypes = [];
    this.stateArray = [];
    this.progressBarDataArray = StaticData.PROGRESS_BAR_VALUES_NEW_DEV_STATE;
    StaticData.StateLabels.forEach((item) => this.stateArray[item.state] = item);
    this.setProgressBarData(ProgressNew.start);
  }

  ngOnInit() {
    this.newDeviceData = new FormGroup({
      sector: new FormControl(this.newDevice.sector, Validators.required),
      serialNumber: new FormControl(this.newDevice.serial_number, Validators.required),
      name: new FormControl(this.newDevice.name, Validators.required),
      description: new FormControl(this.newDevice.description, Validators.required),
      signsAmount: new FormControl(this.newDevice.signs_amount, Validators.required),
      consumerType: new FormControl(this.newDevice.consumer_type, Validators.required)
    });
    this.newDeviceDataindications = new FormGroup({
      valueIndications: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      dateTime: new FormControl(new Date())
    });

    this.oldDeviceDataindications = new FormGroup({
      valueIndications: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      dateTime: new FormControl(this.oldDevice.last_data_time)
    });
    StaticData.DEVICE_TYPES.forEach((item) => this.deviceTypes[item.device_type] = item.name);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmStatus() {
    this.isEmptyFields = false;
    this.isShowError = false;

    let error = ConfirmDeviceStateNewComponent.validateControls(this.newDeviceData.controls);
    if (ConfirmDeviceStateNewComponent.validateControls(this.oldDeviceDataindications.controls)) {
      error = true;
      this.isEmptyFields = true;
      setTimeout(() => this.isEmptyFields = false, StaticData.TIME_INTERVAL);
    }
    if (ConfirmDeviceStateNewComponent.validateControls(this.newDeviceDataindications.controls)) {
      error = true;
      this.isEmptyFields = true;
      setTimeout(() => this.isEmptyFields = false, StaticData.TIME_INTERVAL);
    }

    if (this.dataToSendDescription.invalid) {
      this.isShowError = true;
      setTimeout(() => this.isShowError = false, StaticData.TIME_INTERVAL);
      error = true;
    }
    if (error) {
      return;
    }
    this.isDisabledButton = true;

    this.setProgressBarData(ProgressNew.start);
    this.isRequestinProgress = true;

    this.changeNewDeviceState()
      .then(() => this.changeOldDeviceState())
      .then(() => this.putNewDeviceData())
      .then(() => this.putSampleOldDevice())
      .then(() => this.putSampleNewDevice())
      .then(() => setTimeout(() => this.dialogRef.close(true), 1000))
      .catch(() => {
      });

  }

  changeNewDeviceState() {
    return new Promise((resolve, reject) => {
      const dtoNewDevice = new DtoChangeState();
      dtoNewDevice.user_id = this.userId;
      dtoNewDevice.device_id = this.newDevice.device_id;
      dtoNewDevice.comment = this.dataToSendDescription.controls['description'].value || '';
      dtoNewDevice.time = new Date().toISOString();
      dtoNewDevice.value = DeviceState.WORKED;

      this.service.changeDeviceState(dtoNewDevice, this.newDevice.node_id).subscribe(() => {
        this.setProgressBarData(ProgressNew.firstDone);
        resolve();
      }, () => {
        this.setProgressBarData(ProgressNew.firstError);
        this.isDisabledButton = false;
        reject();
      });
    });
  }

  changeOldDeviceState() {
    return new Promise((resolve, reject) => {
      const dtoOldDevice = new DtoChangeState();
      dtoOldDevice.user_id = this.userId;
      dtoOldDevice.device_id = this.newDevice.device_id;
      dtoOldDevice.comment = this.dataToSendDescription.controls['description'].value || '';
      dtoOldDevice.time = new Date().toISOString();
      dtoOldDevice.value = DeviceState.REPLACED;
      this.service.changeDeviceState(dtoOldDevice, this.oldDevice.node_id).subscribe(() => {
        this.setProgressBarData(ProgressNew.secondDone);
        resolve();
      }, () => {
        this.setProgressBarData(ProgressNew.secondError);
        this.isDisabledButton = false;
        reject();
      });
    });
  }

  putNewDeviceData() {
    return new Promise((resolve, reject) => {
      const dtoChangeNewDeviceData = this.newDevice;
      dtoChangeNewDeviceData.sector = this.newDeviceData.controls['sector'].value;
      dtoChangeNewDeviceData.serial_number = this.newDeviceData.controls['serialNumber'].value;

      dtoChangeNewDeviceData.name = this.newDeviceData.controls['name'].value;
      dtoChangeNewDeviceData.description = this.newDeviceData.controls['description'].value;
      dtoChangeNewDeviceData.consumer_type = this.newDeviceData.controls['consumerType'].value;
      dtoChangeNewDeviceData.signs_amount = this.newDeviceData.controls['signsAmount'].value;

      this.service.putNewDeviceData(dtoChangeNewDeviceData).subscribe(() => {
        this.setProgressBarData(ProgressNew.thirdDone);
        resolve();
      }, () => {
        this.setProgressBarData(ProgressNew.thirdError);
        this.isDisabledButton = false;
        reject();
      });
    });
  }

  putSampleOldDevice() {
    return new Promise((resolve, reject) => {
      const dtoSampleOldDevice = new DtoSampleOldDevice();
      dtoSampleOldDevice.sample_id = this.oldDevice.device_id;
      dtoSampleOldDevice.sample_type = this.oldDevice.device_type;
      dtoSampleOldDevice.sample_time = this.oldDeviceDataindications.controls['dateTime'].value;
      dtoSampleOldDevice.value = this.oldDeviceDataindications.controls['valueIndications'].value;
      dtoSampleOldDevice.user_id = this.userId;
      dtoSampleOldDevice.comment = this.dataToSendDescription.controls['description'].value || '';
      dtoSampleOldDevice.comment_value = CommentValue.lowLevel;
      dtoSampleOldDevice.sample_flag = SampleFlag.web;
      dtoSampleOldDevice.sample_flag_comment = '';
      dtoSampleOldDevice.proposal_device_state = DeviceState.REPLACED;
      dtoSampleOldDevice.node_id = this.oldDevice.node_id;
      dtoSampleOldDevice.device_id = this.oldDevice.device_id;

      this.service.postSample(dtoSampleOldDevice).subscribe(() => {
        this.setProgressBarData(ProgressNew.fourthDone);
        resolve();
      }, () => {
        this.setProgressBarData(ProgressNew.fourthError);
        this.isDisabledButton = false;
        reject();
      });
    });
  }

  setProgressBarData(state: ProgressNew) {
    this.progressBarData = this.progressBarDataArray.find((item: ProgressBarData) => item.progress === state);
    console.log(this.progressBarData);
    if (!this.progressBarData) {
    }
  }

  putSampleNewDevice() {
    return new Promise((resolve, reject) => {
      const dtoSamplenewDevice = new DtoSampleOldDevice();
      dtoSamplenewDevice.sample_id = this.newDevice.device_id;
      dtoSamplenewDevice.sample_type = this.newDevice.device_type;
      dtoSamplenewDevice.sample_time = this.newDeviceDataindications.controls['dateTime'].value;
      dtoSamplenewDevice.value = this.newDeviceDataindications.controls['valueIndications'].value;
      dtoSamplenewDevice.user_id = this.userId;
      dtoSamplenewDevice.comment = this.dataToSendDescription.controls['description'].value || '';
      dtoSamplenewDevice.comment_value = CommentValue.lowLevel;
      dtoSamplenewDevice.sample_flag = SampleFlag.web;
      dtoSamplenewDevice.sample_flag_comment = '';
      dtoSamplenewDevice.proposal_device_state = DeviceState.WORKED;
      dtoSamplenewDevice.node_id = this.newDevice.node_id;
      dtoSamplenewDevice.device_id = this.newDevice.device_id;
      console.log(dtoSamplenewDevice);
      this.service.postSample(dtoSamplenewDevice).subscribe(() => {
        this.setProgressBarData(ProgressNew.fifthDone);
        resolve();
      }, () => {
        this.setProgressBarData(ProgressNew.fifthError);
        this.isDisabledButton = false;
        reject();
      });
    });
  }
}
