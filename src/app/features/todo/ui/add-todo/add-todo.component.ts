import {Component} from '@angular/core';
import {TodoService} from "../../services/todo.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {v4 as uuid} from 'uuid';
import {Todo} from "../../models/todo";
import {Router} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatDatepicker, MatDatepickerInput} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";

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
    NgxMaterialTimepickerModule,
    MatButton,
    MatLabel,
    MatError
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    date: ['', Validators.required],
    time: ['']  // optional
  });

  submitted = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const {title, date, time} = this.form.value;
    const [hours, minutes] = time ? time.split(':').map((v: string) => +v) : [0, 0];
    const expiration = typeof date === 'string' ? new Date(date) : new Date();
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
      this.router.navigate(['/list']);
    });
  }

  goBack() {
    this.router.navigate(['/list']);
  }
}
