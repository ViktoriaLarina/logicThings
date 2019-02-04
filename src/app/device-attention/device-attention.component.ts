import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ALL} from 'tslint/lib/rules/completedDocsRule';
import {AbonentsServiceImpl} from '../communication-module/real/abonents.service';
import {
  DevicesAttention, DevicesAttentionResponse,
  QueryForAttentionDevicesRequest, SortParam
} from '../models/devicesAttentionAll.model';
import {DeviceStateModel, DeviceTypes} from '../models/DeviceState.model';
import {SortField, SortType} from '../utils/all_enum';
import {deleteDeviceAttentionFilters, trySaveFilter} from '../utils/allFunction';
import {DeviceState} from '../utils/DeviceStates';
import {StaticData} from '../utils/staticData';

@Component({
  selector: 'app-device-attention',
  templateUrl: './device-attention.component.html',
  styleUrls: ['./device-attention.component.css']
})
export class DeviceAttentionComponent implements OnInit, OnDestroy {

  ALL_OPTION: string;
  isFiltersVisible: boolean;
  companies: string[];
  districts: string[];
  sectors: string[];
  deviceTypes: DeviceTypes[];
  stateArray: DeviceStateModel[];
  sortParamsForRequest: SortParam;
  selectedCompany: string;
  selectedDistrict: string;
  selectedSector: string;
  selectedState: string | DeviceState;
  selectedDeviceType: number;
  sortParams: SortParam[];
  subscribe: Subscription;

  isArrayCompanyLoading: boolean;
  isArrayDistrictLoading: boolean;
  isArraySectorLoading: boolean;
  areDevicesLoading: boolean;

  areDevicesAlreadyLoading: boolean;

  constructor(private service: AbonentsServiceImpl) {

    this.isFiltersVisible = true;
    this.companies = [];
    this.districts = [];
    this.sectors = [];
    this.deviceTypes = StaticData.DEVICE_TYPES;
    this.sortParams = StaticData.SORT_PARAMS;
    this.ALL_OPTION = StaticData.ALL_OPTION;

    this.subscribe = this.service.devicesForTable.subscribe((data: DevicesAttention) => {
      this.areDevicesAlreadyLoading = Boolean(data);
    });
  }

  ngOnInit() {
    this.selectedCompany = localStorage.getItem('managementCompany');
    this.selectedDistrict = localStorage.getItem('district');
    this.selectedSector = localStorage.getItem('sector');
    this.selectedDeviceType = +localStorage.getItem('deviceType');
    this.selectedState = localStorage.getItem('status');
    const sortType = localStorage.getItem('sortType');
    const sortField = localStorage.getItem('sortField');
    const states = StaticData.StateLabels.filter((item: DeviceStateModel) => item.isForDeviceAttentionPage === true);
    const allStates = new DeviceStateModel();
    allStates.state = DeviceState.ALL;
    allStates.text = 'Все';
    this.stateArray = [allStates].concat(states);
    this.sortParamsForRequest = StaticData.SORT_PARAMS.find((item: SortParam) => item.sortType === sortType as SortType &&
      item.sortField === sortField as SortField) || StaticData.SORT_PARAMS[0];
    this.selectedState = this.stateArray[0].state;

    deleteDeviceAttentionFilters();

    this.fillCompanies()
      .then(() => this.tryFillDistricts())
      .then(() => this.tryFillSectors())
      .then(() => this.tryFillDevices())
      .catch(() => {
      });
  }

  rejectPromise() {
    return new Promise((resovle, reject) => {
      reject();
    });
  }

  ngOnDestroy() {
    this.service.devicesForTable.next(null);
    this.saveDatatoLocalStorage();
    this.subscribe.unsubscribe();
  }

  showHideFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  fillCompanies() {
    return new Promise((resolve, reject) => {
      this.isArrayCompanyLoading = true;
      this.service.getAttentionDevicesFilter().subscribe((response: DevicesAttentionResponse) => {
        this.isArrayCompanyLoading = false;
        this.companies = response.data || [];
        resolve();
      });
    });
  }

  tryFillDistricts() {
    return new Promise((resolve, reject) => {
      if (!this.selectedCompany) {
        reject();
        return;
      }
      this.isArrayDistrictLoading = true;
      this.service.getAttentionDevicesFilter(this.selectedCompany).subscribe((response: DevicesAttentionResponse) => {
        this.isArrayDistrictLoading = false;
        this.districts = [StaticData.ALL_OPTION].concat(response.data) || [];
        resolve();
      });
    });
  }

  tryFillSectors() {
    return new Promise((resolve, reject) => {
      if (!this.selectedDistrict) {
        reject();
        return;
      }
      if (this.selectedDistrict === StaticData.ALL_OPTION) {
        this.isArraySectorLoading = false;
        this.sectors = [StaticData.ALL_OPTION];
        this.selectedSector = StaticData.ALL_OPTION;
        resolve();
      } else {
        this.isArraySectorLoading = true;
        this.service.getAttentionDevicesFilter(this.selectedCompany, this.selectedDistrict)
          .subscribe((response: DevicesAttentionResponse) => {
            this.isArraySectorLoading = false;
            this.sectors = [StaticData.ALL_OPTION].concat(response.data) || [];
            resolve();
          });
      }
    });
  }

  tryFillDevices() {
    this.areDevicesLoading = true;
    return new Promise((resolve, reject) => {
      if (!this.selectedDistrict || !this.selectedDeviceType) {
        reject();
        return;
      }
      this.areDevicesAlreadyLoading = false;

      const dto = {} as QueryForAttentionDevicesRequest;
      dto.company = this.selectedCompany;
      dto.district = this.selectedDistrict;
      dto.sector = this.selectedSector;
      dto.deviceType = this.selectedDeviceType;
      dto.state = this.selectedState as DeviceState;
      dto.sortType = this.sortParamsForRequest.sortType;
      dto.sortField = this.sortParamsForRequest.sortField;
      this.service.queryForAttentionDevicesReq.next(dto);
      this.service.getAttentionDevices(dto)
        .subscribe((response: DevicesAttention) => {
          this.areDevicesLoading = false;
          this.areDevicesAlreadyLoading = true;
          this.saveDatatoLocalStorage();
          this.service.devicesForTable.next(response);
          resolve();
        });
    });
  }

  onCompanyChange() {
    this.selectedDistrict = '';
    this.selectedSector = '';
    this.selectedDeviceType = null;
    this.service.devicesForTable.next(null);
    this.saveDatatoLocalStorage();
    this.tryFillDistricts().then();
  }

  onDistrictChange() {
    this.selectedSector = '';
    this.selectedDeviceType = null;
    this.service.devicesForTable.next(null);
    this.saveDatatoLocalStorage();
    this.tryFillSectors().then();
  }

  onSectorChange() {
    this.selectedDeviceType = null;
    this.service.devicesForTable.next(null);
    this.saveDatatoLocalStorage();
  }

  onParamsChange() {
    this.service.devicesForTable.next(null);
    this.saveDatatoLocalStorage();
    this.tryFillDevices();
  }

  saveDatatoLocalStorage() {
    trySaveFilter('managementCompany', this.selectedCompany);
    trySaveFilter('district', this.selectedDistrict);
    trySaveFilter('sector', this.selectedSector);
    trySaveFilter('status', this.selectedState);
    trySaveFilter('deviceType', this.selectedDeviceType);

    if (this.sortParamsForRequest) {
      trySaveFilter('sortType', this.sortParamsForRequest.sortType);
      trySaveFilter('sortField', this.sortParamsForRequest.sortField);
    }
  }

}
