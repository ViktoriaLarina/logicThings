import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'selectPipe'})
export class SelectPipe implements PipeTransform {
  transform(value: string): string {
      let text;
      if (value === '*') {
        return text = 'Все';
      } else if (value === 'all') {
      return text = 'Все';
    } else {
        return text = value;
      }

  }
}
