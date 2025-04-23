import {Component, Input} from '@angular/core';
import {Todo} from "../../models/todo";
import {TodoService} from "../../services/todo.service";
import {MatTooltip} from "@angular/material/tooltip";
import {DatePipe, NgIf} from "@angular/common";
import {AppTimerComponent} from "../app-timer/app-timer.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {isToday} from "../../../../shared/utility/is-today";

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    MatTooltip,
    NgIf,
    AppTimerComponent,
    MatIcon,
    MatIconButton,
    DatePipe
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  pendingFav = false;
  pendingDel = false;

  constructor(private todoService: TodoService) {}

  toggleFav() {
    this.pendingFav = true;
    const updated = { ...this.todo, isFavorite: !this.todo.isFavorite };
    this.todoService.update(updated).subscribe(() => this.pendingFav = false);
  }

  remove() {
    this.pendingDel = true;
    this.todoService.delete(this.todo.id).subscribe(() => this.pendingDel = false);
  }

  protected readonly isToday = isToday;
}
