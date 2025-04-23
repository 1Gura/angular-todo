import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {interval, map, startWith} from "rxjs";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './app-timer.component.html',
  styleUrl: './app-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTimerComponent {
  @Input() expiration!: string;
  timeLeft$ = interval(1000).pipe(
    startWith(0),
    map(() => {
      const exp = new Date(this.expiration).getTime();
      const diff = exp - Date.now();
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      return { totalMs: diff, hrs, mins, secs };
    })
  );
}
