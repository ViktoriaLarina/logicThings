import { AbstractControl, ValidatorFn } from '@angular/forms';

export class limitValidator {
  static ExceedLimit(limit: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const inputValue = Number(control.value);
      return (inputValue > limit) ? {'exceedlimit': {value: inputValue}} : null;
    };
  }
}
