import { Input, Component, OnChanges, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators, FormGroup} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as readingsUtil from './Util/readings-data-util';

import {
    IDeviceDataPeriod,
    INodeModel,
    ICurrentNodeDevices
} from '../interfaces/allInterfaces';
import { NewReadings } from '../models/newReadings';
import { NewDateForReadings } from '../models/newDateForReadings';
import { CoreAbonentsService } from '../core-module/servises/core.abonents.service';
import { StoreService } from '../store/store.service';

import { PhotoDialogComponent } from './photo-dialog/photo-dialog.component';
import { ReadingsDeleteDialogComponent } from './readings-confirm-delete/readings-confirm-delete.component';
import {StaticData} from "../utils/staticData";

@Component({
  selector: 'app-device-readings',
  templateUrl: './device-readings.component.html',
  styleUrls: ['./device-readings.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: StaticData.MY_FORMAT },
  ],
})
export class DeviceReadingsComponent implements OnChanges, OnInit {
  @Input() currentDevice: ICurrentNodeDevices;
  currentDateAndTime: boolean;
  currentNode: INodeModel;
  currentUser: any;
  deviceReadingsData: any;
  deviceRowData: Array<any>;
  editingData: any;
  editReadings: any;
  hoursFormControl: FormControl;
  loading: boolean;
  minutesFormControl: FormControl;
  newDateForReadings: NewDateForReadings;
  newEndData: any;
  newReadings: NewReadings;
  period: IDeviceDataPeriod;
  periodUnits: string;
  readingsFormControl: FormControl;
  tableFormControl: FormControl;
  unit: string;
  private dialogRef: MatDialogRef<any>;
  selectedSample: any;

  // Change form
  changeForm: FormGroup;
  useCurrentDate2Change = false;
  temporaryTime = {};

  constructor(
    public dialog: MatDialog,
    private abonentsService: CoreAbonentsService,
    private store: StoreService,
  ) {
    this.store.currentNodeEvent.subscribe((cur) => this.currentNode = cur);
    this.currentUser = this.store.getCurrentUser();
    this.period = {
      date: moment(),
      periodType: 'day',
      dateToShow: '',
      startingDate: moment().startOf('day'),
      endingDate: moment().endOf('day'),
      typeDataRendering: 'table',
      mode: '',
      placeholder: '',
      savedDate: '',
      periodChoosen: '',
      modalPeriod: false,
      periodChecked: true,
      yearChecked: true,
    };
    this.deviceReadingsData = [];
    this.deviceRowData = [];
    this.unit = '';
    this.periodUnits = '';
    this.loading = false;
    this.newEndData = '';
    this.editingData = '';
    this.editReadings = '';
    this.currentDateAndTime = false;
    this.newReadings = new NewReadings;
    this.newDateForReadings = new NewDateForReadings;
    this.hoursFormControl = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(2),
      Validators.min(0),
      Validators.max(23),
      Validators.pattern(/[0-9]{1,2}/),
    ]);
    this.minutesFormControl = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(2),
      Validators.min(0),
      Validators.max(59),
      Validators.pattern(/[0-9]{1,2}/),
    ]);
    this.readingsFormControl = new FormControl('', [
      Validators.pattern(/^[0-9]+([.][0-9]{0,3})?$/),
    ]);
    this.tableFormControl = new FormControl('', [
      Validators.pattern(/^[0-9]+([.][0-9]{0,3})?$/),
    ]);
  }

  ngOnInit() {
    this.setDateToShow(this.period.date, this.period.periodType);
    this.setSavedDate(this.period.date);
    this.setPeriodChoosen(this.period.startingDate, this.period.endingDate);
  }

  ngOnChanges(val) {
    this.currentNode = this.store.currentNode;

    // Check current period
    const id = this.currentNode.parent_id;
    if (this.store.getCurrentPeriod(id)) {
      this.period = this.store.getCurrentPeriod(id);
    } else {
      this.store.setCurrentPeriod(id, this.period);
    }

    if (val.currentDevice.currentValue) {
      this.unit = readingsUtil.setUnits(val.currentDevice.currentValue);
    }
    this.getDeviceReadingsData();
  }

  changePeriodOfDeviceData(period: string) {
    this.setPeriodType(period);
    this.setActualPeriod();
    this.setDateToShow(this.period.savedDate, period);
    // Save period to store
    this.store.setCurrentPeriod(this.currentNode.parent_id, this.period);
    this.getDeviceReadingsData();
  }

  changeTypeViewingData(viewType: string) {
    this.period.typeDataRendering = viewType;
  }

  checkDatePeriod() {
    const startDate = this.period.startingDate;
    const endDate = this.period.endingDate;
    const diff = endDate - startDate;
    if (startDate > endDate) {
      this.period.periodChecked = false;
      this.period.yearChecked = true;
      return;
    }
    if (31622400000 < diff) {
      this.period.periodChecked = true;
      this.period.yearChecked = false;
      return;
    }
    this.period.periodChecked = true;
    this.period.yearChecked = true;
  }

  checkReadings() {
    if (this.newReadings.value && !isNaN(this.newReadings.value) && this.newReadings.comment) {
      if (this.currentDateAndTime) {
        return true;
      } else if (this.newDateForReadings.date
        && this.newDateForReadings.hour.length === 2
        && this.newDateForReadings.minutes.length === 2
        && (+this.newDateForReadings.hour >= 0 && +this.newDateForReadings.hour < 24)
        && (+this.newDateForReadings.minutes >= 0 && +this.newDateForReadings.minutes < 60)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  createReadings() {
    if (this.newReadings.value && !isNaN(this.newReadings.value) && this.newReadings.comment) {
      if (this.currentDateAndTime) {
        this.newReadings.sample_time = moment().toISOString();
      } else {
        this.newReadings.sample_time = this.newDateForReadings.date
          .hours(+this.newDateForReadings.hour)
          .minutes(+this.newDateForReadings.minutes)
          .toISOString();
      }
      this.newReadings.device_id = this.currentDevice.device_id;
      this.newReadings.node_id = this.currentDevice.node_id;
      this.newReadings.sample_type = this.currentDevice.device_type;
      this.newReadings.user_id = this.currentUser.user_id;
      this.newReadings.value = ( this.newReadings.value * 1000 ) + '';
      this.newReadings.comment_value = this.newReadings.comment_value;
      this.newReadings.proposal_device_state = this.currentDevice['last_state'];
      const readingsToServer = Object.assign({}, this.newReadings);
      this.abonentsService.createReadings(this.currentNode, this.currentDevice, readingsToServer);
      this.newReadings = new NewReadings;
      this.currentDateAndTime = false;
      this.newDateForReadings = new NewDateForReadings;
    }
  }

  decreaseSavedDate() {
    switch (this.period.periodType) {
      case 'day': this.period.savedDate = moment(this.period.savedDate).subtract(1, 'd');
        break;
      case 'month': this.period.savedDate = moment(this.period.savedDate).subtract(1, 'M');
        break;
      case 'year': this.period.savedDate = moment(this.period.savedDate).subtract(1, 'y');
        break;
    }
    this.setDateToShow(this.period.savedDate, this.period.periodType);
    this.setActualPeriod();
    this.getDeviceReadingsData();
  }

  deleteReadings(sample) {
    const dialogRef = this.dialog.open(ReadingsDeleteDialogComponent, {
      width: '60%',
      data: { time: sample.sample_time, node: this.currentNode, device: this.currentDevice}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteReadingsWhenConfirmed(sample);
      }
    });
  }

  increaseSavedDate() {
    switch (this.period.periodType) {
      case 'day': this.period.savedDate = moment(this.period.savedDate).add(1, 'd');
        break;
      case 'month': this.period.savedDate = moment(this.period.savedDate).add(1, 'M');
        break;
      case 'year': this.period.savedDate = moment(this.period.savedDate).add(1, 'y');
        break;
    }
    this.setDateToShow(this.period.savedDate, this.period.periodType);
    this.setActualPeriod();
    this.getDeviceReadingsData();
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(PhotoDialogComponent, {
      data: {
        item: item,
        node_id: this.currentNode.node_id,
        device_id: this.currentDevice.device_id,
        user: this.currentUser
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openChangeDialog(templateRef: TemplateRef<any>, sample) {
    this.dialogRef = this.dialog.open(templateRef);
    this.selectedSample = sample;

    const date = new Date(sample.sample_time),
      maxValue = sample.next ? sample.next : '';

    // Build form for chaging sample
    const
      value = new FormControl(+sample.value / 1000, [
        Validators.required,
        Validators.pattern(/^[0-9]+([.][0-9]{0,3})?$/)
      ]),
      sampleDate = new FormControl( {
        value: date.toISOString(),
        disabled: false
      }, [Validators.required]),
      sampleTimeH = new FormControl(
        {
          value: this.addZero(date.getHours()),
          disabled: false
        },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.min(0),
          Validators.max(23),
          Validators.pattern(/[0-9]{1,2}/),
        ]),
      sampleTimeM = new FormControl(
        {
          value: this.addZero(date.getMinutes()),
          disabled: false
        },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.min(0),
          Validators.max(59),
          Validators.pattern(/[0-9]{1,2}/),
        ]),
      comment = new FormControl(sample.comment, [Validators.required]),
      comment_value = new FormControl(sample.comment_value.toString(), [Validators.required]),
      device_state = new FormControl(sample.proposal_device_state, [Validators.required]);

    this.changeForm = new FormGroup({
      value: value,
      sampleDate: sampleDate,
      sampleTimeH: sampleTimeH,
      sampleTimeM: sampleTimeM,
      comment: comment,
      comment_value: comment_value,
      device_state: device_state
    });
  }

  useCurrentDate(e) {
    let newDate = new Date();

    if (e.checked) {
      // Disabled all fields
      this.changeForm.controls
        .sampleDate.disable();

      this.changeForm.controls
        .sampleTimeH.disable();

      this.changeForm.controls
        .sampleTimeM.disable();

    } else {
      newDate = new Date(this.selectedSample.sample_time);

      // Enable all fields
      this.changeForm.controls
        .sampleDate.enable();

        this.changeForm.controls
        .sampleTimeH.enable();

        this.changeForm.controls
        .sampleTimeM.enable();
    }

      // Set new values
      this.changeForm.controls
        .sampleDate.setValue(newDate.toISOString());
      this.changeForm.controls
        .sampleTimeH.setValue(this.addZero(newDate.getHours()));
      this.changeForm.controls
        .sampleTimeM.setValue(this.addZero(newDate.getMinutes()));
  }

  useCurrentDate4NewSample(e) {
    const newDate = new Date();
    if (e.checked) {
      // Save added date
      if (this.newDateForReadings.date) {
        this.temporaryTime['date'] = this.newDateForReadings.date;
      }
      if (this.newDateForReadings.hour) {
        this.temporaryTime['hour'] = this.newDateForReadings.hour;
      }
      if (this.newDateForReadings.minutes) {
        this.temporaryTime['minutes'] = this.newDateForReadings.minutes;
      }
      // Set current date
      this.newDateForReadings.date = newDate.toISOString();
      this.newDateForReadings.hour = this.addZero(newDate.getHours());
      this.newDateForReadings.minutes = this.addZero(newDate.getMinutes());
    } else {
      // Set an old date
      if (this.temporaryTime['date']) {
        this.newDateForReadings['date'] = this.temporaryTime['date'];
      }
      if (this.temporaryTime['hour']) {
        this.newDateForReadings['hour'] = this.temporaryTime['hour'];
      }
      if (this.temporaryTime['minutes']) {
        this.newDateForReadings['minutes'] = this.temporaryTime['minutes'];
      }
    }
  }

  periodToggle() {
    this.period.modalPeriod = !this.period.modalPeriod;
  }

  closeDialog() {
    this.dialog.closeAll();
    this.selectedSample = {};
  }

  saveSample() {
    // Set loading state for form

    const item = JSON.parse(JSON.stringify(this.selectedSample)),
      controls = this.changeForm.controls;

    item.value = ( controls.value.value * 1000 ) + '';
    delete item.prev;
    delete item.prev_time;
    delete item.next;
    item.comment = controls.comment.value;
    item.user_id = this.currentUser.user_id;
    item.comment_value = +controls.comment_value.value;
    item.sample_flag = 20;
    item.sample_flag_comment = '';
    item.proposal_device_state = controls.device_state.value;

    item.sample_time = new Date(controls.sampleDate.value);
    item.sample_time.setHours(+controls.sampleTimeH.value);
    item.sample_time.setMinutes(+controls.sampleTimeM.value);
    item.sample_time = item.sample_time.toISOString();
    this.abonentsService.saveReadings(this.currentNode, this.currentDevice, item);
    this.closeDialog();
  }

  addZero(i: any) {
    if (+i < 10) {
        i = '0' + i;
    }
    return i;
  }

  reFreshData(event) {
    this.setSavedDate(event.value);
    this.setActualPeriod();
    this.setDateToShow(this.period.savedDate, this.period.periodType);
    this.getDeviceReadingsData();
  }

  saveInFile() {
    if (this.deviceReadingsData[0]) {
      const arr = readingsUtil.parseToSave(this.deviceReadingsData, this.periodUnits, this.unit);
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const wbout: string = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
      FileSaver.saveAs(new Blob([readingsUtil.s2ab(wbout)]), 'LoThingsMeter.xlsx');
    }
  }

  savePeriodOfDates() {
    this.periodToggle();
    this.period.startingDate.startOf('day');
    this.period.endingDate.endOf('day');
    this.setPeriodChoosen(this.period.startingDate, this.period.endingDate);
    this.getDeviceReadingsData();
  }

  setPeriodType(period: string) {
    this.period.periodType = period;
  }

  private deleteReadingsWhenConfirmed(item) {
    const item2delete = {
      node_id: this.currentDevice.node_id,
      device_id: this.currentDevice.device_id,
      sample_id: item.sample_id
    };
    this.abonentsService.deleteReadings(this.currentNode, this.currentDevice, item2delete);
    this.editingData = '';
  }

  private getDeviceReadingsData() {
    this.loading = true;
    const param = {
      from: moment(this.period.startingDate).toISOString(),
      till: moment(this.period.endingDate).toISOString(),
      perPage: 100000
    };
    if (this.currentNode && this.currentDevice.device_id) {
      this.abonentsService.getDeviceReadingsData(this.currentNode, this.currentDevice, param)
        .subscribe(
          (success: any) => {
            const samples = success.samples ? success.samples : [];
            this.deviceReadingsData = [];
            this.deviceRowData = samples;
            this.periodUnits = readingsUtil.periodUnits(this.period);
            const parseData = samples.map( (e, i, a) => {
              if (a[i - 1]) {
                const prevE = a[i - 1];
                e['prev_time'] = prevE['sample_time'] ? prevE['sample_time'] : '';
                e['prev'] = prevE['value'];
              } else {
                e['prev_time'] = 0;
                e['prev'] = 0;
              }
              return e;
            });
            this.deviceReadingsData = parseData;
            this.loading = false;
          });
    } else {
      this.deviceReadingsData = [];
      this.deviceRowData = [];
      this.loading = false;
    }
  }

  private setActualPeriod() {
    const savedDateStr = moment(this.period.savedDate).format();
    const savedDateObj = moment(savedDateStr);
    switch (this.period.periodType) {
      case 'day': {
        this.period.startingDate = moment(savedDateObj).startOf('day');
        this.period.endingDate = moment(savedDateObj).endOf('day');
      }
        break;
      case 'month': {
        this.period.startingDate = moment(savedDateObj).startOf('month');
        this.period.endingDate = moment(savedDateObj).endOf('month');
      }
        break;
      case 'quarter': {
        this.period.startingDate = moment(savedDateObj).subtract(3, 'month').endOf('month');
        this.period.endingDate = moment(savedDateObj).endOf('month');
      }
        break;
      case 'year': {
        this.period.startingDate = moment(savedDateObj).startOf('year');
        this.period.endingDate = moment(savedDateObj).endOf('year');
      }
        break;
    }
  }

  private setDateToShow(dateToShow, dateType) {
    switch (dateType) {
      case 'day': {
        this.period.dateToShow = moment(dateToShow).format('DD.MM.YYYY');
      }
        break;
      case 'month': {
        this.period.dateToShow = moment(dateToShow).format('MM.YYYY');
      }
        break;
      case 'year': {
        this.period.dateToShow = moment(dateToShow).get('year');
      }
        break;
    }
  }

  private setPeriodChoosen(startingDate, endingDate) {
    this.period.periodChoosen = `${moment(startingDate).format('DD.MM.YYYY')} - ${moment(endingDate).format('DD.MM.YYYY')}`;
  }

  private setSavedDate(date) {
    this.period.savedDate = date;
  }
}
