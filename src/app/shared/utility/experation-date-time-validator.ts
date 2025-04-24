import {AbstractControl, ValidationErrors} from "@angular/forms";

export function expirationDateTimeValidator(control: AbstractControl): ValidationErrors | null {
  const date: Date | null = control.get('date')?.value ?? null;
  const time: string | null = control.get('time')?.value ?? null;

  if (!date) {
    return null;
  }

  const exp = new Date(date);
  if (time) {
    const [h, m] = time.split(':').map(v => +v);
    exp.setHours(h, m, 0, 0);
  } else {
    // если времени нет, считаем полночь
    exp.setHours(0, 0, 0, 0);
  }

  return exp.getTime() < Date.now()
    ? { pastDateTime: true }
    : null;
}
