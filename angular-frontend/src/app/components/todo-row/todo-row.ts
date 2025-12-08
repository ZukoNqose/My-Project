import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../models/todo-item.model';

@Component({
  selector: 'app-todo-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-row.html',
  styleUrl: './todo-row.css',
})
export class TodoRow implements OnInit {
  @Input() todo!: TodoItem;
  @Output() toggle = new EventEmitter<void>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();
  
  @ViewChild('editInput') editInput?: ElementRef<HTMLInputElement>;
  
  editing = signal(false);
  editTitle = signal('');

  ngOnInit() {
    this.editTitle.set(this.todo.title);
  }

  startEditing() {
    this.editing.set(true);
    setTimeout(() => this.editInput?.nativeElement.focus(), 0);
  }

  saveEdit() {
    const trimmed = this.editTitle().trim();
    if (trimmed && trimmed !== this.todo.title) {
      this.edit.emit(trimmed);
    }
    this.editing.set(false);
    this.editTitle.set(this.todo.title);
  }

  cancelEdit() {
    this.editing.set(false);
    this.editTitle.set(this.todo.title);
  }

  onToggle() {
    this.toggle.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}