import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class CoreAlertsService {
  customAlert: any;
  public errorEvent: EventEmitter<any>;
  public warningEvent: EventEmitter<any>;
  public successEvent: EventEmitter<any>;

  constructor() {
    this.errorEvent = new EventEmitter();
    this.warningEvent = new EventEmitter();
    this.successEvent = new EventEmitter();
  }

  errorAlert(error: any): void {
    switch (error.status) {
      case 404:
        this.customAlert = {
          type: 'danger',
          message: 'Страница не найдена'
        };
        break;
      case 502:
        this.customAlert = {
          type: 'danger',
          message: 'В данный момент сервер временно недоступен. Повторите попытку позже'
        };
        break;
      case 500: {
        if (error.json().message.indexOf('all ready used') > 0) {
          this.customAlert = {
            type: 'danger',
            message: 'Login уже зарезервирован'
          };
          break;
        }
        if (error.json().message === 'record not found') {
          this.customAlert = {
            type: 'danger',
            message: 'Введен некорректный логин и/или пароль. Повторите попытку'
          };
          break;
        } else {
          this.customAlert = {
            type: 'danger',
            message: 'Ошибка сервера. Повторите попытку'
          };
        }
      }
                break;
      default:
        this.customAlert = {
          type: 'danger',
          message: 'Ошибка сервера. Повторите попытку'
        };
        break;
    }
    this.errorEvent.emit(this.customAlert);
  }

  warningAlert(message: string): void {
    const customAlert = {
      type: 'warning',
      message: message
    };
    this.warningEvent.emit(customAlert);
  }

  successAlert(message: string): void {
    const customAlert = {
      type: 'success',
      message: message
    };
    this.successEvent.emit(customAlert);
  }

  // public warningAlert(error: any): void {
  //   this.warningEvent.next(error);
  // }
  //
  // public successAlert(error: any): void {
  //   this.successEvent.next(error);
  // }
}


