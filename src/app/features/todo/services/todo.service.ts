import {Injectable} from '@angular/core';
import {JSONSchema, StorageMap} from "@ngx-pwa/local-storage";
import {BehaviorSubject, delay, map, Observable, of, tap} from "rxjs";
import {Todo} from "../models/todo";


const STORAGE_KEY = 'todos';
const FAKE_DELAY_MS = 350; // можно варьировать 300–400

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private inited = false;

  constructor(private storage: StorageMap) {
  }

  private ensureInit(): Observable<Todo[]> {
    const todoSchema: JSONSchema = {
      type: 'object',
      properties: {
        id: {type: 'string'},
        title: {type: 'string', maxLength: 100},
        createdAt: {type: 'string'},
        expiration: {type: 'string'},
        isFavorite: {type: 'boolean'}
      },
      required: ['id', 'title', 'createdAt', 'expiration', 'isFavorite'],
    };

    if (this.inited) {
      return of(this.todos$.value);
    }
    return this.storage.get(STORAGE_KEY).pipe(
      map(data =>
        Array.isArray(data) ? data : []
      ),
      tap(list => {
        this.todos$.next(list);
        this.inited = true;
      })
    );
  }

  listAll(): Observable<Todo[]> {
    return this.ensureInit().pipe(delay(FAKE_DELAY_MS));
  }

  create(todo: Todo): Observable<void> {
    const next = [...this.todos$.value, todo];
    this.todos$.next(next);
    return this.storage.set(STORAGE_KEY, next).pipe(delay(FAKE_DELAY_MS));
  }

  update(updated: Todo): Observable<void> {
    const next = this.todos$.value.map(t => t.id === updated.id ? updated : t);
    this.todos$.next(next);
    return this.storage.set(STORAGE_KEY, next).pipe(delay(FAKE_DELAY_MS));
  }

  delete(id: string): Observable<void> {
    const next = this.todos$.value.filter(t => t.id !== id);
    this.todos$.next(next);
    return this.storage.set(STORAGE_KEY, next).pipe(delay(FAKE_DELAY_MS));
  }

  getTodosStream(): Observable<Todo[]> {
    this.ensureInit().subscribe(); // триггерим загрузку
    return this.todos$.asObservable();
  }
}
