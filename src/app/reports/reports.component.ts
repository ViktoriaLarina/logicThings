import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {AbonentsServiceImpl} from '../communication-module/real/abonents.service';
import {CoreAbonentsService} from '../core-module/servises/core.abonents.service';
import {PhotoDialogComponent} from '../device-readings/photo-dialog/photo-dialog.component';
import {ICurrentDeviceValues} from '../interfaces/allInterfaces';
import {DeviceTypes} from '../models/DeviceState.model';
import {DtoStatistics, StatisticsResponse} from '../models/DtoStatistics';
import {StoreService} from '../store/store.service';
import {trySaveFilter} from '../utils/allFunction';
import {IMonth, StaticData} from '../utils/staticData';
import * as reportsUtils from './utils/reports-utils';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: StaticData.MY_FORMAT}
  ]
})
export class ReportsComponent implements OnInit, OnDestroy {

  FIRST_YEAR = 2000;
  LAST_YEAR = 2040;
  statisticsDataLoading: boolean;
  managementCompanies: any[];
  districts: any[];
  sectors: any[];
  devices: DeviceTypes[];
  dataForReport: any[];
  pagination: any;
  reportParameters: any;
  filterDataLoading: string | boolean;
  reportDataLoading: boolean;
  reportExist: boolean;
  unit: string;
  periodToShow: string;
  addition: boolean;
  newReportValue: ICurrentDeviceValues;
  sortTownAsc: boolean;
  sortDistrictAsc: boolean;
  activeItem: number;
  isSingleClick = true;
  selectedRow = {};
  toDay = new Date();
  selectedDevice = {};
  deviceInfoLoading = true;
  deviceInfoLoaded = false;
  currentUser: any;
  selectedComment: string;
  isFiltersVisible: boolean;
  statisticsData: StatisticsResponse;

  years: number[];
  months: IMonth[] = StaticData.Months;

  selectedYear: number;
  selectedMonth: IMonth;

  private dialogRef: MatDialogRef<any>;
  private dialogPreviewRef: MatDialogRef<any>;

  constructor(private abonentsService: CoreAbonentsService,
              private service: AbonentsServiceImpl,
              private store: StoreService,
              private dialog: MatDialog) {

    this.resetFilters();
    this.setDefaultReportValues();
    this.resetPaginationSettings();
    this.initDatePicker();
    this.currentUser = this.store.getCurrentUser();
    this.loadFilters();

    this.dataForReport = [];
    this.unit = '';
    this.periodToShow = '';
    this.store.createReportEvent.subscribe((event) => {
      if (event.message === 'create') {
        this.getReport(1, true, event.data);
      }
    });

    this.changeDate();
  }

  private loadFilters() {
    const startDate = +localStorage.getItem('startDateReports');
    const endDate = +localStorage.getItem('endDateReports');
    this.reportParameters = {
      management_company: localStorage.getItem('managmentCompanyReports'),
      district: localStorage.getItem('districtReports'),
      sector: localStorage.getItem('sectorReports'),
      device_type: +localStorage.getItem('deviceTypeReports') || 0,
      device_values: [
        {
          device_value_id: '',
          device_id: '',
          device_value_type: 0,
          device_value: ''
        }
      ],
      startingDate: startDate ? moment(startDate).startOf('month') : moment().startOf('month'),
      endingDate: endDate
        ? moment(endDate).endOf('month')
        : moment().endOf('month'),
      periodChecked: true,
      sort_type: 'asc',
      sort_field: 'by_district'
    };

    const date = this.reportParameters.startingDate.toDate() || new Date();
    this.selectedYear = date.getFullYear();
    const month = date.getMonth();
    this.selectedMonth = this.months.find((m) => m.value === month);
  }

  private resetFilters() {
    this.devices = StaticData.DEVICE_TYPES;
    this.managementCompanies = [];
    this.districts = [];
    this.sectors = [];

    this.addition = false;
    this.isFiltersVisible = true;
    this.filterDataLoading = false;
    this.reportDataLoading = false;
    this.reportExist = false;
    this.sortTownAsc = true;
    this.sortDistrictAsc = true;
  }

  private setDefaultReportValues() {
    this.newReportValue = {
      deviceType: 0,
      loadCharacteristics: {name: '', id: '', device_id: ''},
      accuracyClass: {name: '', id: '', device_id: ''},
      energyType: {name: '', id: '', device_id: ''},
      phaseQuantity: {name: '', id: '', device_id: ''},
      transformationCoefficient: {name: '', id: '', device_id: ''},
      decimal: {name: '', id: '', device_id: ''},
      deploymentPlace: {name: '', id: '', device_id: ''},
      entranceQuantity: {name: '', id: '', device_id: ''}
    };
  }

  private resetPaginationSettings() {
    this.pagination = {
      length: 0,
      pageIndex: 0,
      pageSize: 25,
      pageSizeOptions: StaticData.ITEMS_PER_PAGE
    };
  }

  private initDatePicker() {
    this.years = [];
    for (let i = this.FIRST_YEAR; i <= this.LAST_YEAR; i++) {
      this.years.push(i);
    }
  }

  ngOnInit() {
    this.filterDataLoading = 'start';
    this.getStatistics();
    this.onInitLoadingFiltersManagementCompanies()
      .then(() => this.onInitLoadingDistricts())
      .then(() => this.onInitLoadingDeviceTypes());
  }

  getStatistics() {


    if (!this.reportParameters.management_company || !this.reportParameters.district || !this.reportParameters.sector || !this.reportParameters.device_type) {
      console.log('not present all params');
      return;
    }

    this.statisticsDataLoading = true;
    this.statisticsData = {} as StatisticsResponse;
    const date = moment(new Date(this.selectedYear, this.selectedMonth.value));

    const dto = {
      management_company: this.reportParameters.management_company,
      district: this.reportParameters.district === 'all' ? '' : this.reportParameters.district,
      sector: this.reportParameters.sector === 'all' ? '' : this.reportParameters.sector,
      device_type: this.reportParameters.device_type,
      startingDate: this.reportParameters.startingDate.toISOString(),
      endingDate: this.reportParameters.endingDate.toISOString()
    } as DtoStatistics;

    console.log(dto.endingDate);
    console.log(dto.startingDate);
    this.service.getStatistics(dto).subscribe((data: StatisticsResponse) => {
      this.statisticsDataLoading = false;
      this.statisticsData = data;
      console.log(data);
    }, error => {
      this.statisticsDataLoading = false;
    });
  }

  onInitLoadingFiltersManagementCompanies() {
    return new Promise((resolve, reject) => {
      const dto = {
        management_company: '',
        district: '',
        device_type: 0
      };

      this.service.getReportFilters(dto).subscribe((data: any) => {
        this.managementCompanies = data.data;
        this.filterDataLoading = false;
        resolve();
      }, (error) => {
        reject();
      });
    });
  }

  onInitLoadingDistricts() {
    return new Promise((resolve, reject) => {
      const dto = {
        management_company: localStorage.getItem('managmentCompanyReports'),
        district: '',
        device_type: 0
      };
      this.filterDataLoading = 'district';
      this.service.getReportFilters(dto).subscribe((data: any) => {
        this.districts = data.data;
        this.filterDataLoading = false;
        resolve();
      }, (error) => {
        reject();
      });
    });
  }

  onInitLoadingDeviceTypes() {
    return new Promise((resolve, reject) => {
      const dto = {
        management_company: localStorage.getItem('managmentCompanyReports'),
        district: localStorage.getItem('districtReports'),
        device_type: +localStorage.getItem('deviceTypeReports')
      };
      this.filterDataLoading = 'sector';
      this.service.getReportFilters(dto).subscribe((data: any) => {
        this.sectors = data.data;
        this.filterDataLoading = false;
        resolve();
      }, (error) => {
        reject();
      });
    });
  }

  ngOnDestroy() {
    this.saveFiltersToLocalStorage();
  }

  saveFiltersToLocalStorage() {
    trySaveFilter('managmentCompanyReports', this.reportParameters.management_company);
    trySaveFilter('districtReports', this.reportParameters.district);
    trySaveFilter('sectorReports', this.reportParameters.sector);
    trySaveFilter('deviceTypeReports', this.reportParameters.device_type);
    trySaveFilter('startDateReports', this.reportParameters.startingDate.valueOf());
    trySaveFilter('endDateReports', this.reportParameters.endingDate.valueOf());
  }

  toggleActiveItem(i) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        if (i !== this.activeItem) {
          this.activeItem = i;
        } else {
          this.activeItem = null;
        }
      }
    }, 200);
  }

  openRowModalWindow(templateRef: TemplateRef<any>, row, i) {
    this.isSingleClick = false;
    this.activeItem = i;

    const startDate = new Date(this.reportParameters.startingDate);

    const params = {
      from: new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 1).toISOString(),
      till: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59).toISOString()
    };

    const states = this.abonentsService.getDeviceStates(row.device.node_id, row.device.device_id);
    const samples = this.abonentsService.getDeviceSamples(row.device.node_id, row.device.device_id, params);

    // Build row address
    this.selectedDevice['address'] = row.district.value + ' р-н, ';
    this.selectedDevice['address'] += row.location.value + row.loc_name.value + ' ' + row.building.value;
    if (row.appartment.value) {
      this.selectedDevice['address'] += ' кв.' + row.appartment;
    }

    this.selectedDevice['type'] = row.device.device_type.value;
    this.selectedDevice['name'] = row.device.name;
    this.selectedDevice['device_number'] = row.device.serial_number;
    this.selectedDevice['bill_number'] = row.device.bill_number;

    this.selectedDevice['node_id'] = row.device.node_id;
    this.selectedDevice['device_id'] = row.device.device_id;

    this.selectedDevice['state'] = this.deviceStateToString(row.device.last_state);

    forkJoin([
      states,
      samples
    ]).subscribe((r) => {
      this.selectedDevice['device_states'] = r[0]['device_states'];
      this.selectedDevice['samples'] = r[1]['samples'];
      this.deviceInfoLoading = false;
      this.deviceInfoLoaded = true;
    });

    this.dialogRef = this.dialog.open(templateRef);

    this.dialogRef.afterClosed().subscribe(() => {
      this.selectedDevice = {};
      this.deviceInfoLoading = true;
      this.deviceInfoLoaded = false;
    });
  }

  closeDialog(el) {
    this.dialog.closeAll();
    this.selectedDevice = {};
    this.deviceInfoLoading = true;
    this.deviceInfoLoaded = false;
  }

  openPhotoPreviwDialog(item, node_id, device_id): void {
    const dialogPreviewRef = this.dialog.open(PhotoDialogComponent, {
      data: {
        item,
        node_id,
        device_id,
        user: this.currentUser
      }
    } as MatDialogConfig);
  }

  openCommentPreviewDialog(item: TemplateRef<any>, comment): void {
    this.selectedComment = comment;
    const dialogPreviewRef = this.dialog.open(item);

    this.dialogPreviewRef.afterClosed().subscribe(() => {
      this.selectedComment = '';
    });
  }

  closePreviewDialog() {
    this.dialogPreviewRef.close();
  }

  showHideFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  changeDate() {
    const date = moment(new Date(this.selectedYear, this.selectedMonth.value));
    this.reportParameters.startingDate = date.startOf('month').toDate();
    this.reportParameters.endingDate = date.endOf('month').toDate();

    this.getStatistics();
  }

  deviceStateToString(state) {
    switch (state) {
      case 'worked':
        return 'Работает';
      case 'absent':
        return 'Отсутствует';
      case 'new':
        return 'Новое';
      case 'replaced':
        return 'Замененное';
      case 'not_worked_confirm':
        return 'Не работает (проверено)';
      case 'absent_confirm':
        return 'Отсутствует (проверено)';
    }
  }

  getNextFilter(id, filterSet) {
    if (id === 'device_type' && filterSet.device_type !== 0 && filterSet.district === '') {
      return;
    }
    this.filterDataLoading = id;
    this.abonentsService.getNextFilter(filterSet)
      .subscribe((success) => {
          if (success) {
            this.setNextSelect(id, success);
          }
          this.filterDataLoading = false;
        }
      );
  }

  getNextCriterion(id) {

      this.getStatistics();

    this.reportExist = false;
    switch (id) {
      case 'management_company':
        this.districts = [];
        this.sectors = [];
        this.reportParameters.district = '';
        this.reportParameters.sector = '';
        this.reportParameters.device_type = 0;
        break;
      case 'district':
        this.reportParameters.sector = '';
        this.reportParameters.device_type = 0;
        this.newReportValue.deviceType = 0;
        break;
      case 'device_type':
        this.newReportValue.deviceType = Number(this.reportParameters.device_type);
        this.sectors = [];
        this.reportParameters.sector = this.reportParameters.district === 'all' ? 'all' : '';
        break;
    }

    const filterSet = {
      management_company: this.reportParameters.management_company,
      district: this.reportParameters.district === 'all' ? '' : this.reportParameters.district,
      device_type: +this.reportParameters.device_type
    };
    this.getNextFilter(id, filterSet);
  }

  setNextSelect(prevSelect, nextCriterion) {
    if (prevSelect && nextCriterion) {
      switch (prevSelect) {
        case 'start':
          this.managementCompanies = nextCriterion;
          break;
        case 'management_company':
          this.districts = nextCriterion;
          break;
        case 'device_type':
          this.sectors = nextCriterion;
          break;
      }
    }
  }

  checkReadyForReport() {
    if (this.reportParameters.management_company && this.reportParameters.district && this.reportParameters.device_type && this.reportParameters.periodChecked) {
      if (this.reportParameters.district === 'all') {
        // this.readyForReport = true;
        return true;
      } else {
        if (this.reportParameters.sector) {
          // this.readyForReport = true;
          return true;
        } else {
          // this.readyForReport = false;
          return false;
        }
      }
    } else {
      // this.readyForReport = false;
      return false;
    }
  }

  getReport(page = 1, file = false, user_id) {

    this.getStatistics();

    const startDate = new Date(this.reportParameters.startingDate);

    const reqParam = {
      management_company: this.reportParameters.management_company,
      district: this.reportParameters.district === 'all' ? '' : this.reportParameters.district,
      sector: this.reportParameters.sector === 'all' ? '' : this.reportParameters.sector,
      device_type: this.reportParameters.device_type,
      device_values: [],
      from: new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 1),
      till: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59),
      page,
      perPage: this.pagination.pageSize,
      sort_type: this.reportParameters.sort_type,
      sort_field: this.reportParameters.sort_field
    };

    reqParam.device_values = reportsUtils.reportValueParse(this.newReportValue);
    if (reqParam.device_type && reqParam.perPage
      && this.reportParameters.periodChecked
      && reqParam.sort_type && reqParam.sort_field) {
      if (file) {
        reqParam.page = 11111111111;
        reqParam.perPage = 1111111111111;
        reqParam.sort_type = 'asc';
        reqParam.sort_field = 'town';

        this.abonentsService.requestForReportMake(reqParam, user_id)
          .subscribe((success) => {
            this.store.createReportEvent.next({message: 'done'});
          });
      } else {
        this.reportDataLoading = true;
        this.dataForReport = [];
        this.abonentsService.getDataForReport(reqParam).subscribe(
          (success) => {
            this.reportDataLoading = false;
            const resp: any = success;
            this.unit = reportsUtils.setUnits(resp.reports);
            this.dataForReport = reportsUtils.reportDataProcessing(resp.reports);
            console.log(this.dataForReport);
            this.reportExist = true;
            this.setItemQuantity(resp.total);
          }
        );
      }
    } else {
      this.reportDataLoading = false;
    }
    // }
  }

  setItemQuantity(quantity) {
    this.pagination.length = quantity;
  }

  // saveInFile() {
  //   if (this.dataForReport[0]) {
  //     // const arr = this.parseToSave(this.dataForReport);
  //     const table = document.getElementById('rep-table');
  //     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
  //     // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //     const wbout: string = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
  //     FileSaver.saveAs(new Blob([this.s2ab(wbout)]), 'LoThingsMeterReport.xlsx');
  //   }
  // }
  //
  // s2ab(s) {
  //   const buf = new ArrayBuffer(s.length);
  //   const view = new Uint8Array(buf);
  //   for (let i = 0; i !== s.length; ++i) {
  //     view[i] = s.charCodeAt(i) & 0xFF;
  //   }
  //   return buf;
  // }
  // parseToSave(data) {
  //   const fullArr = [
  //     ['Период выборки'],
  //     [
  //       'Адрес',
  //       '№ договора',
  //       '№ счета',
  //       'Название устройства',
  //       'Назначение',
  //       'Серийный №',
  //       'Показания за период',
  //       'Район',
  //       'Участок',
  //       'Обслуживающая компания',
  //       'ФИО мастера',
  //       'ФИО электрика'
  //     ]
  //   ];
  //   for (let i = 0; i < data.length; i++) {
  //     const arr = [];
  //     arr.push(data[i].address);
  //     arr.push(data[i].agreement_number);
  //     arr.push(data[i].bill_number);
  //     arr.push(data[i].device_name);
  //     arr.push(data[i].function);
  //     arr.push(data[i].serial_number);
  //     arr.push(data[i].periodReadings);
  //     arr.push(data[i].district);
  //     arr.push(data[i].site);
  //     arr.push(data[i].service_company);
  //     arr.push(data[i].master_name);
  //     arr.push(data[i].woker_name);
  //     fullArr.push(arr);
  //   }
  //   return fullArr;
  // }

  changeView(event) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.pageIndex = event.pageIndex;
    this.getReport(event.pageIndex + 1, false, undefined);
  }

  sortColumn(field) {
    this.reportParameters.sort_field = field;
    this.reportParameters.sort_type = this.reportParameters.sort_type === 'asc' ? 'desc' : 'asc';
    this.getReport(undefined, false, undefined);
  }
}
