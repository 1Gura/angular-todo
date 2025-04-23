import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: 'add', loadComponent: () => import('./features/todo/ui/add-todo/add-todo.component').then(m => m.AddTodoComponent) },
  { path: 'list', loadComponent: () => import('./features/todo/ui/todo-list/todo-list.component').then(m => m.TodoListComponent) },
  { path: 'favorite', loadComponent: () => import('./features/todo/ui/todo-list/todo-list.component').then(m => m.TodoListComponent) },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list' }
];
