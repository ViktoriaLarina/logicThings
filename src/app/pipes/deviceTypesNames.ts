import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'deviceTypesNames'})
export class deviceTypesNamesPipe implements PipeTransform {
  transform(value: number): string {
    if (value) {
      let deviceTypeName;
      switch (value) {
        case 10:
          deviceTypeName = 'Электричество';
          break;
        case 20:
          deviceTypeName = 'Вода холодная';
          break;
        case 30:
          deviceTypeName = 'Вода горячая';
          break;
        case 40:
          deviceTypeName = 'Газ';
          break;
        case 50:
          deviceTypeName = 'Тепло';
          break;
      }
      return deviceTypeName;
    }
  }
}
