import {Component, Input} from '@angular/core';
import {Todo} from "../../../features/todo/models/todo";
import {DatePipe, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {AppTimerComponent} from "../../../features/todo/ui/app-timer/app-timer.component";
import {MatIconButton} from "@angular/material/button";
import {TodoService} from "../../../features/todo/services/todo.service";

@Component({
  selector: 'app-todo-list-widget',
  standalone: true,
  imports: [
    NgIf,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCheckbox,
    MatCell,
    MatIcon,
    AppTimerComponent,
    DatePipe,
    MatHeaderCellDef,
    MatCellDef,
    MatIconButton,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './todo-list-widget.component.html',
  styleUrl: './todo-list-widget.component.scss'
})
export class TodoListWidgetComponent {
  @Input({ required: true }) todos!: Todo[];
  @Input() title = '';

  /** Определяем колонки */
  displayedColumns = ['select', 'createdAt', 'timeLeft', 'actions']
  /** Для блокировки кнопок по id */
  pendingFavorites = new Set<string>();
  pendingDeletes   = new Set<string>();

  constructor(private todoService: TodoService) {}

  toggleFavorite(todo: Todo) {
    this.pendingFavorites.add(todo.id);

    const updated: Todo = {
      ...todo,
      isFavorite: !todo.isFavorite
    };

    this.todoService.update(updated).subscribe({
      next: () => this.pendingFavorites.delete(todo.id),
      error: () => this.pendingFavorites.delete(todo.id)
    });
  }

  deleteTodo(id: string) {
    this.pendingDeletes.add(id);

    this.todoService.delete(id).subscribe({
      next: () => this.pendingDeletes.delete(id),
      error: () => this.pendingDeletes.delete(id)
    });
  }
}
