import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BaseResponseModel, NodeResponseModel} from '../responses/base.response.model';
import {
  IAbonentsAddressModel, IUserResponse, INodeModels, INodeRequest,
  INodeModel, ICurrentNodeDevices
} from '../../interfaces/allInterfaces';
import {BASIC_PATH} from '../../constants';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export abstract class AbonentsService {
  abstract getDataForReport(data: any, key: string): Observable<any>;
  abstract getDeviceStates(nodeId: string, deviceId: string, key: string): Observable<any>;
  abstract getDeviceSamples(nodeId: string, deviceId: string, key: string, params: object): Observable<any>;
  abstract getNextCriterion(data: string, key: string): Observable<any>;
  abstract getNextFilter(data: any, key: string): Observable<any>;
  abstract getDeviceReadingsData(node: INodeModel, key: string, device: ICurrentNodeDevices, param: any): Observable<any>;
  abstract getNodes(nodeReq?: INodeRequest): Observable<any>;
  abstract getFilters(key: string, client: any, district?: string, deviceType?: string, sector?: string): Observable<any>;
  abstract searchNodes(searchData: string, key: string, client: any, page: number, perPage: number): Observable<any>;
  abstract getNodeValues(nodeReq?: INodeRequest): Observable<any>;
  abstract getNodeDevices(nodeReq?: INodeRequest): Observable<any>;
  abstract createDevice(dev: {}, key: string, node: INodeModel): Observable<any>;
  abstract saveDevice(dev: {}, key: string, node: INodeModel): Observable<any>;
  abstract deleteDevice(dev: {}, key: string, node: INodeModel): Observable<any>;
  abstract saveNode(node: INodeModel, key: string): Observable<any>;
  abstract deleteNode(node?: INodeModel, key?: string): Observable<any>;
  abstract createNode(node: INodeModel, key: string): Observable<any>;
  abstract saveValues(vals: Array<{}>, key: string, node: INodeModel): Observable<any>;
  abstract createValues(vals: Array<{}>, key: string, node: INodeModel): Observable<any>;
  abstract getDeviceValues(device: {}, node: INodeModel, key: string): Observable<any>;
  abstract createDeviceValue(device: {}, node: INodeModel, key: string, vals: {}): Observable<any>;
  abstract saveDeviceState(device: {}, node: INodeModel, key: string, stat: {}): Observable<any>;
  abstract saveDeviceValue(device: {}, node: INodeModel, key: string, vals: {}): Observable<any>;
  abstract getUser(id: string, key: string): Observable<any>;
  abstract saveReadings(node: INodeModel, key: string, device: {}, item: {}): Observable<any>;
  abstract createReadings(node: INodeModel, key: string, device: {}, item: {}): Observable<any>;
  abstract deleteReadings(node: INodeModel, key: string, device: {}, item: {}): Observable<any>;
  abstract getDeviceState(device_id: string, node_id: string, key: string): Observable<any>;
  abstract getPhotoForReadings(node_id: string, device_id: string, data_id: string, key: string): Observable<any>;
  abstract getReportsList(user_id: string, key: string): Observable<any>;
  abstract requestForReportMake(data: any, user_id: string, key: string): Observable<any>;
  abstract reportActions(data: any, user_id: string, key: string): Observable<any>;
  abstract getAssignedUsers(currentNodeId: string, key: string): Observable<any>;
  abstract getAllUsers(key: string): Observable<any>;
  abstract assignNewUser(dataForAssign: any, key: string): Observable<any>;
  abstract changeUserAssigningAccess(dataForUpdateAssign: any, key: string): Observable<any>;
  abstract deleteUserAssigning(dataForDeleteAssign: any, key: string): Observable<any>;
}
