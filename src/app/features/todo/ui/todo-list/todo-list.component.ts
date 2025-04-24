import {Component} from '@angular/core';
import {Todo} from "../../models/todo";
import {map, Observable, of} from "rxjs";
import {TodoService} from "../../services/todo.service";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TodoItemComponent} from "../todo-item/todo-item.component";
import {TodoListWidgetComponent} from "../../../../shared/components/list-widget/todo-list-widget.component";

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    TodoItemComponent,
    TodoListWidgetComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  all$: Observable<Todo[]> = of([]);
  today$: Observable<Todo[]> = of([]);
  others$: Observable<Todo[]> = of([]);

  public routeSnapshot: string | undefined = '';

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) {
    this.routeSnapshot = route.snapshot.routeConfig?.path;

    const isFav = this.route.snapshot.routeConfig!.path === 'favorite';
    this.all$ = this.todoService.getTodosStream().pipe(
      map(list => isFav ? list.filter(t => t.isFavorite) : list)
    );

    if (!isFav) {
      const todayStr = new Date().toISOString().slice(0,10);
      this.today$ = this.all$.pipe(
        map(list => list.filter(t => t.expiration.slice(0,10) === todayStr))
      );
      this.others$ = this.all$.pipe(
        map(list => list.filter(t => t.expiration.slice(0,10) !== todayStr))
      );
    }
  }
}
