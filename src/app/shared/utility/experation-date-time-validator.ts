import {AbstractControl, ValidationErrors} from "@angular/forms";
import {parse12hTime} from "./parse-time";

export function expirationDateTimeValidator(control: AbstractControl): ValidationErrors | null {
  const dateVal: Date | null   = control.get('date')?.value ?? null;
  const timeVal: string | null = control.get('time')?.value ?? null;

  if (!dateVal) {
    // без даты дальше не проверяем
    return null;
  }

  const exp = new Date(dateVal);

  if (timeVal) {
    const [h, m] = parse12hTime(timeVal);
    exp.setHours(h, m, 0, 0);
  } else {
    // без времени — конец дня
    exp.setHours(23, 59, 59, 999);
  }

  return exp.getTime() < Date.now()
    ? { pastDateTime: true }
    : null;
}
