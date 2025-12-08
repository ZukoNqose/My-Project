import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-input.html',
  styleUrl: './todo-input.css',
})
export class TodoInput {
  @Input() loading = signal(false);  
  @Output() addTodo = new EventEmitter<string>();
  title = signal('');

  onSubmit() {
    const trimmed = this.title().trim();
    if (!trimmed) return;
    this.addTodo.emit(trimmed);
    this.title.set('');
  }
}