import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoRow } from './todo-row';

describe('TodoRow', () => {
  let component: TodoRow;
  let fixture: ComponentFixture<TodoRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
