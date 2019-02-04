import {Injectable} from '@angular/core';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BASIC_PATH} from '../../constants';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CoreAlertsService} from '../../core-module/servises/core.alerts.service';
import {
  DevicesAttention, DtoChangeState, DtoSampleOldDevice,
  QueryForAttentionDevicesRequest
} from '../../models/devicesAttentionAll.model';
import {StaticData} from '../../utils/staticData';
import {DtoStatistics} from "../../models/DtoStatistics";

@Injectable()
export class AbonentsServiceImpl {
  headers: any;

  queryForAttentionDevicesReq = new BehaviorSubject<QueryForAttentionDevicesRequest>(null);
  devicesForTable = new BehaviorSubject<DevicesAttention>(null);

  constructor(private http: HttpClient, private localStorage: AsyncLocalStorage, private alertService: CoreAlertsService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'});
  }

  getDataForReport(data, key) {
    const fullPath = BASIC_PATH + '/reports';
    return this.http.post(fullPath, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    })
      .catch((error: any) => Observable.throw(error));
  }

  getDeviceStates(nodeId, deviceId, key) {
    const fullPath = BASIC_PATH + `/nodes/${nodeId}/devices/${deviceId}/device_states
`;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key })
      })
      .map(resp => resp)
      .catch((error: any) => Observable.throw(error));
  }

  getDeviceSamples(nodeId, deviceId, key, params) {
    const fullPath = BASIC_PATH + `/nodes/${nodeId}/devices/${deviceId}/samples?from=${params.from}&till=${params.till}`;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key })
      })
      .map(resp => resp)
      .catch((error: any) => Observable.throw(error));
  }

  getNextFilter(data, key) {
    const fullPath = BASIC_PATH + '/reports/filter';
    return this.http.post(fullPath, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    })
      .catch((error: any) => Observable.throw(error));
  }

  getNextCriterion(data, key) {
    const fullPath = BASIC_PATH + '/categories?value_type=' + data;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getDeviceReadingsData(node, key, device, param) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id +
      '/devices/' + device.device_id +
      '/samples?from=' + param.from +
      '&till=' + param.till +
      '&page=1' +
      '&perPage=' + param.perPage;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getNodes(nodeReq) {
    const key: string = nodeReq.api_key;

    const fullPath = BASIC_PATH + '/nodes?parent_id=' + nodeReq.parent_id;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getFilters(key, client, district?, deviceType?, sector?) {
    let fullPath = BASIC_PATH +
      '/nodes/search_extra/filter_data?parent_id=' + client.node_id;

    if (district) fullPath += '&districts=' + district;
    if (deviceType) fullPath += '&device_type=' + deviceType;
    if (sector) fullPath += '&sector=' + sector;

    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  searchNodes(searchData, key, client, page, perPage) {
    let fullPath = '';
    if (!client.selectedFilters.district) {
      fullPath = BASIC_PATH +
        '/nodes/search?parent_id=' + client.node_id +
        '&search=' + searchData +
        '&page=' + page +
        '&perPage=' + perPage +
        '&sort=asc';
    } else {
      fullPath = BASIC_PATH +
        '/nodes/search_extra?parent_id=' + client.node_id +
        '&search=' + searchData +
        '&page=' + page +
        '&perPage=' + perPage +
        '&sort=asc';

      // Add search filter params
      const f = client.selectedFilters;
      if (f.district && f.district !== '*') fullPath += '&districts=' + f.district;
      if (f.deviceType.key && f.deviceType.key !== '*') fullPath += '&device_type=' + f.deviceType.key;
      if (f.sector.key && f.sector.key !== '*') fullPath += '&sector=' + f.sector.key;
    }

    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  saveNode(node, key) {
    const fullPath = BASIC_PATH + '/nodes';
    return this.http.put(fullPath, node, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  deleteNode(node, key) {
    const fullPath = BASIC_PATH + '/nodes?node_id=' + node.node_id;
    return this.http.delete(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  createNode(node, key) {
    const fullPath = BASIC_PATH + '/nodes';
    return this.http.post(fullPath, node, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getNodeValues(nodeReq) {
    const key: string = nodeReq.api_key;

    const fullPath = BASIC_PATH + '/nodes/' + nodeReq.node_id + '/values';
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  saveValues(vals, key, node) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/values';
    return this.http.put(fullPath, {values: vals}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  createValues(vals, key, node) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/values';
    return this.http.post(fullPath, {values: vals}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getNodeDevices(nodeReq) {
    const key: string = nodeReq.api_key;

    const fullPath = BASIC_PATH + '/nodes/' + nodeReq.node_id + '/devices';
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  createDevice(dev, key, node) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices';
    return this.http.post(fullPath, dev, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  saveDevice(dev, key, node) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices';
    return this.http.put(fullPath, dev, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  deleteDevice(dev, key, node) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices?device_id=' + dev.device_id;
    return this.http.delete(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getDeviceValues(device, node, key) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/device_values';
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  createDeviceValue(device, node, key, vals) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/device_values';
    return this.http.post(fullPath, {device_values: vals}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  saveDeviceValue(device, node, key, vals) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/device_values';
    return this.http.put(fullPath, {device_values: vals}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  saveDeviceState(device, node, key, stat) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/device_states';
    return this.http.post(fullPath, {device_states: stat}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getUser(id, key) {
    const fullPath = BASIC_PATH + '/user/' + id;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  createReadings(node, key, device, item) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/samples';
    return this.http.post(fullPath, item, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  saveReadings(node, key, device, item) {
    const fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/samples';
    return this.http.put(fullPath, item, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  deleteReadings(node, key, device, item) {
    let fullPath = BASIC_PATH + '/nodes/' + node.node_id + '/devices/' + device.device_id + '/samples';
    fullPath += '?node_id=' + node.node_id + '&device_id=' + item.device_id + '&sample_id=' + item.sample_id;
    return this.http.delete(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getDeviceState(device_id, node_id, key) {
    const fullPath = BASIC_PATH + '/nodes/' + node_id + '/devices/' + device_id + '/device_states';
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getPhotoForReadings(node_id, device_id, data_id, key) {
    const fullPath = BASIC_PATH + '/nodes/' + node_id + '/devices/' + device_id + '/data/' + data_id + '/file';
    return this.http.get(fullPath, {
      responseType: 'blob', headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => Observable.throw(error));
  }

  getReportsList(user_id, key) {
    const fullPath = BASIC_PATH + '/reports/processor?perPage=999';
    return this.http.get(fullPath, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': key
      })
    })
      .catch((error: any) => error);
  }

  requestForReportMake(data, user_id, key) {
    const fullPath = BASIC_PATH + '/reports/processor';
    return this.http.post(fullPath, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    }).catch((error: any) => Observable.throw(error));
  }

  reportActions(data, user_id, key) {
    const fullPath = BASIC_PATH + '/reports/processor';
    return this.http.post(fullPath, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    }).catch((error: any) => Observable.throw(error));
  }

  getAssignedUsers(currentNodeId, key) {
    const fullPath = BASIC_PATH + '/nodes/assign/' + currentNodeId;
    return this.http.get(fullPath, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    })
      .catch((error: any) => Observable.throw(error));
  }

  getAllUsers(key) {
    const fullPath = BASIC_PATH + '/users';
    return this.http.get(fullPath, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    })
      .catch((error: any) => Observable.throw(error));
  }

  assignNewUser(dataForAssign, key) {
    const fullPath = BASIC_PATH + '/nodes/assign/' + dataForAssign.node_id;
    return this.http.post(fullPath, dataForAssign, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    })
      .catch((error: any) => Observable.throw(error));
  }

  changeUserAssigningAccess(dataForUpdateAssign, key) {
    const fullPath = BASIC_PATH + '/nodes/assign/' + dataForUpdateAssign.node_id;
    return this.http.put(fullPath, dataForUpdateAssign, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
    })
      .catch((error: any) => Observable.throw(error));
  }

  deleteUserAssigning(dataForDeleteAssign, key) {
    const fullPath = BASIC_PATH + '/nodes/assign/' + dataForDeleteAssign.node_id;
    return this.http.delete(fullPath, {
      headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key}),
      params: {
        user_id: dataForDeleteAssign.user_id,
        user_access_id: dataForDeleteAssign.user_access_id
      }
    })
      .catch((error: any) => Observable.throw(error));
  }

  getAttentionDevicesFilter(managementCompany?: string, district?: string) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          let fullPath = `${BASIC_PATH}/devices/attention/filter`;

          if (managementCompany) {
            fullPath = `${fullPath}?management_company=${managementCompany}`;
          }

          if (district) {
            fullPath = `${fullPath}&district=${district}`;
          }

          return this.http.get(fullPath, options)
            .subscribe((resp) => observer.next(resp), (error) => {
              this.alertService.errorAlert(error);
              observer.error(error);
            });
        });
    });
  }

  getAttentionDevices(dto: QueryForAttentionDevicesRequest, page: number = 0, perPage?: number) {
    page++;
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          if (!perPage) {
            perPage = StaticData.ITEMS_PER_PAGE[0];
          }

          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const fullPath = `${BASIC_PATH}/devices/attention?management_company=${dto.company}&district=${dto.district}&sector=${dto.sector}&device_type=${dto.deviceType}&page=${page}&perPage=${perPage}&sort_type=${dto.sortType}&sort_field=${dto.sortField}&device_state=${dto.state}`;
          return this.http.get(fullPath, options)
            .subscribe((resp) => observer.next(resp), (error) => {
              this.alertService.errorAlert(error);
              observer.error(error);
            });
        });
    });
  }

  changeDeviceState(dto: DtoChangeState, nodeId: string) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const body = {
            device_states: [dto]
          };
          const fullPath = `${BASIC_PATH}/nodes/${nodeId}/devices/${dto.device_id}/device_states`;
          return this.http.post(fullPath, body, options)
            .subscribe((resp) => observer.next(resp),
              (error: any) => {
                  this.alertService.errorAlert(error);
                  observer.error(error);
                });
        });
    });
  }

  getParentNode(nodeId: string, parentId: string) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const fullPath = `${BASIC_PATH}/nodes/${nodeId}/devices/${parentId}`;

          return this.http.get(fullPath, options)
            .catch((error: any) => {
            return Observable.throw(error);
            }).subscribe((resp) => observer.next(resp));
        });
    });
  }

  putNewDeviceData(data) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const fullPath = `${BASIC_PATH}/nodes/${data.node_id}/devices`;

          return this.http.put(fullPath, data, options).subscribe((resp) => observer.next(resp),
            (error: any) => {
              this.alertService.errorAlert(error);
              observer.error(error);
            });
        });
    });
  }

  postSample(data: DtoSampleOldDevice) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const fullPath = `${BASIC_PATH}/nodes/${data.node_id}/devices/${data.device_id}/samples`;

          return this.http.post(fullPath, data, options).subscribe((resp) => observer.next(resp), error => {
            this.alertService.errorAlert(error);
            return Observable.throw(error);
          });
        });
    });
  }

  getReportFilters(data: any) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const fullPath = `${BASIC_PATH}/reports/filter`;

          return this.http.post(fullPath, data, options).subscribe((resp) => observer.next(resp), error => {
            this.alertService.errorAlert(error);
            return Observable.throw(error);
          });
        });
    });
  }

  getStatistics(dto: DtoStatistics) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8', 'X-API-KEY': key})
          };
          const fullPath = `${BASIC_PATH}/samples/statistics?management_company=${dto.management_company}&district=${dto.district}&sector=${dto.sector}&device_type=${dto.device_type}&till=${dto.startingDate}&from=${dto.endingDate}`;

          return this.http.get(fullPath, options).subscribe((resp) => observer.next(resp), error => {
            this.alertService.errorAlert(error);
            return Observable.throw(error);
          });
        });
    });
  }

}
