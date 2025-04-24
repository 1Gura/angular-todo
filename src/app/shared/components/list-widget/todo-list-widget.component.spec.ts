import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TodoListWidgetComponent} from './todo-list-widget.component';

describe('ListWidgetComponent', () => {
  let component: TodoListWidgetComponent;
  let fixture: ComponentFixture<TodoListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
