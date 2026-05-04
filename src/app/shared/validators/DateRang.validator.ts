import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(
  fromControlName: string,
  toControlName: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromDate = group.get(fromControlName)?.value;
    const toDate = group.get(toControlName)?.value;

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  };
}
