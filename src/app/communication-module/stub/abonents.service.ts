import {AbonentsService} from '../services/abonents.service';
import {Observable} from 'rxjs/Observable';
import {BaseResponseModel} from '../responses/base.response.model';
import {IAbonentsAddressModel} from '../../interfaces/allInterfaces';

// export class AbonentsServiceImpl extends AbonentsService {
  export class AbonentsServiceImpl {


  getUserAddress(): Observable<BaseResponseModel<Array<string>>> {
    return new Observable<BaseResponseModel<Array<string>>>(observer => {
      observer.next({
        code: 0,
        message: 'string',
        data: ['kiev', 'kharkov', 'dnepr']
      });
      observer.complete();
    });
  }

  getCities(): Observable<BaseResponseModel<Array<string>>> {
    return new Observable<BaseResponseModel<Array<string>>>(observer => {
        observer.next({
          code: 0,
          message: 'string',
          data: ['kiev', 'kharkov', 'dnepr']
        });
        observer.complete();
    });
  }

  getStreets(rawData: IAbonentsAddressModel): Observable<BaseResponseModel<Array<string>>> {
    return new Observable<BaseResponseModel<Array<string>>>(observer => {
      observer.next({
        code: 0,
        message: 'string',
        data: ['street1', 'street2', 'street3']
      });
      observer.complete();
    });
  }

  getBuildings(rawData: IAbonentsAddressModel): Observable<BaseResponseModel<Array<string>>> {
    return new Observable<BaseResponseModel<Array<string>>>(observer => {
      observer.next({
        code: 0,
        message: 'string',
        data: ['kiev', 'kharkov', 'dnepr']
      });
      observer.complete();
    });
  }

  getEntrances(rawData: IAbonentsAddressModel): Observable<BaseResponseModel<Array<string>>> {
    return new Observable<BaseResponseModel<Array<string>>>(observer => {
      observer.next({
        code: 0,
        message: 'string',
        data: ['kiev', 'kharkov', 'dnepr']
      });
      observer.complete();
    });
  }

  getFlats(rawData: IAbonentsAddressModel): Observable<BaseResponseModel<Array<string>>> {
    return new Observable<BaseResponseModel<Array<string>>>(observer => {
      observer.next({
        code: 0,
        message: 'string',
        data: ['kiev', 'kharkov', 'dnepr']
      });
      observer.complete();
    });
  }
}
