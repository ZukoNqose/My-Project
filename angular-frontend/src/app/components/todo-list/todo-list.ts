import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo-item.model';
import { TodoInput } from '../todo-input/todo-input';
import { FilterBar, FilterType } from '../filter-bar/filter-bar';
import { TodoRow } from '../todo-row/todo-row';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoInput,
    FilterBar,
    TodoRow
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  todos = signal<TodoItem[]>([]);
  filteredTodos = signal<TodoItem[]>([]);
  currentFilter = signal<FilterType>('all');
  isLoading = signal(false);
  isCreating = signal(false);
  error = signal<string | null>(null);

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.isLoading.set(true);
    this.error.set(null);
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error loading todos.');
        this.isLoading.set(false);
      }
    });
  }

  onAddTodo(title: string) {
    this.isCreating.set(true);
    this.todoService.createTodo({ title, isComplete: false }).subscribe({
      next: (newTodo) => {
        this.todos.update(todos => [...todos, newTodo]);
        this.applyFilter();
        this.isCreating.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error creating todo.');
        this.isCreating.set(false);
      }
    });
  }

  onToggleTodo(todo: TodoItem) {
    const updated = { ...todo, isComplete: !todo.isComplete };
    this.todoService.updateTodo(todo.id, updated).subscribe({
      next: () => {
        this.todos.update(todos => 
          todos.map(t => t.id === todo.id ? updated : t)
        );
        this.applyFilter();
      },
      error: (err) => {
        this.error.set(err.message || 'Error updating todo.');
      }
    });
  }

  onEditTodo(todo: TodoItem, newTitle: string) {
    const updated = { ...todo, title: newTitle };
    this.todoService.updateTodo(todo.id, updated).subscribe({
      next: () => {
        this.todos.update(todos => 
          todos.map(t => t.id === todo.id ? updated : t)
        );
        this.applyFilter();
      },
      error: (err) => {
        this.error.set(err.message || 'Error updating todo.');
      }
    });
  }

  onDeleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(t => t.id !== id));
        this.applyFilter();
      },
      error: (err) => {
        this.error.set(err.message || 'Error deleting todo.');
      }
    });
  }

  onFilterChange(filter: FilterType) {
    this.currentFilter.set(filter);
    this.applyFilter();
  }

  applyFilter() {
    const todos = this.todos();
    const filter = this.currentFilter();
    
    if (filter === 'all') {
      this.filteredTodos.set(todos);
    } else if (filter === 'active') {
      this.filteredTodos.set(todos.filter(t => !t.isComplete));
    } else {
      this.filteredTodos.set(todos.filter(t => t.isComplete));
    }
  }
}