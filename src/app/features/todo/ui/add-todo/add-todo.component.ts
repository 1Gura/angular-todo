import {Component, Input} from '@angular/core';
import {TodoService} from "../../services/todo.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {v4 as uuid} from 'uuid';
import {Todo} from "../../models/todo";
import {Router} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {noop} from "rxjs";
import {expirationDateTimeValidator} from "../../../../shared/utility/experation-date-time-validator";
import {parse12hTime} from "../../../../shared/utility/parse-time";

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    MatToolbar,
    ReactiveFormsModule,
    MatIcon,
    MatFormField,
    MatInput,
    MatIconButton,
    NgIf,
    MatDatepickerInput,
    MatDatepicker,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatButton,
    MatLabel,
    MatError,
    MatDatepickerToggle,
    MatHint,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent {
  @Input() title = 'Add TODO'
  form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      date: ['', Validators.required],
      time: ['']  // optional
    },
    {
      validators: expirationDateTimeValidator
    });

  submitted = false;
  isSaving = false;

  readonly minDate: Date;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today;
  }

  get formControls() {
    return this.form.controls;
  }

  get dateControl() {
    return this.formControls.date;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const {title, date, time} = this.form.value;
    const [hours, minutes] = time
      ? parse12hTime(time)
      : [23, 59];

    const expiration = new Date(date as string);

    expiration.setHours(hours, minutes, 0, 0);

    if (expiration.getTime() < Date.now()) {
      this.formControls.date.setErrors({past: true});
      return;
    }

    this.isSaving = true;
    const todo: Todo = {
      id: uuid(),
      title: title ?? '',
      createdAt: new Date().toISOString(),
      expiration: expiration.toISOString(),
      isFavorite: false
    };
    this.todoService.create(todo).subscribe(() => {
      this.router.navigate(['/list']).then(noop);
    });
  }


  goBack() {
    this.router.navigate(['/list']).then(noop);
  }
}
