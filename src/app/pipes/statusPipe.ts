import { Pipe, PipeTransform } from '@angular/core';
import {DeviceState} from '../utils/DeviceStates';

@Pipe({name: 'statusPipe'})
export class StatusPipe implements PipeTransform {
  transform(value: DeviceState): string {
    if (value) {
      let title;
      switch (value) {
        case DeviceState.ALL:
          title = 'Все';
          break;
        case DeviceState.WORKED:
          title = 'рабочий';
          break;
        case DeviceState.NOT_WORKED:
          title = 'нерабочий';
          break;
        case DeviceState.REPLACED:
          title = 'замененный';
          break;
        case DeviceState.ABSENT:
          title = 'отсутствует';
          break;
        case DeviceState.NEW:
          title = 'новый';
          break;
        case DeviceState.NOT_WORKED_CONFIRM:
          title = 'нерабочий (подтверждено)';
          break;
        case DeviceState.ABSENT_CONFIRM:
          title = 'отсутствует (подтверждено)';
          break;
      }
      return title;
    }
  }
}
