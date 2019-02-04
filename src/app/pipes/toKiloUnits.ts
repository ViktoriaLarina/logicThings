import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toKiloUnits'})
export class toKiloUnitsPipe implements PipeTransform {
  transform(value: number): number {
    if (value) {
      let kiloUnits = Number(value) / 1000;
      return kiloUnits;
    }
  }
}



