import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { TodoItem } from '../types/todo.js';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Row = styled.div<{ $complete: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  color: ${p => p.$complete ? p.theme.colors.completed : p.theme.colors.primary};
`;
const Checkbox = styled.input`
  margin-right: 1rem;
`;
const Title = styled.span<{ $complete: boolean }>`
  flex: 1 1 auto;
  font-size: 1.07rem;
  text-decoration: ${p => p.$complete ? 'line-through' : 'none'};
  opacity: ${p => p.$complete ? 0.7 : 1};
  cursor: pointer;
`;
const EditInput = styled.input`
  font-size: 1.07rem;
  flex: 1 1 auto;
  padding: 2px 4px;
  border-radius: 0.2rem;
  border: 1px solid #bbb;
`;
const Delete = styled.button`
  background: none;
  color: #ee4444;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
  line-height: 1;
`;
interface Props {
  todo: TodoItem;
  onToggle: () => void;
  onEdit: (title: string) => void;
  onDelete: () => void;
}
export function TodoRow({ todo, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  
  function handleSave() {
    if (title.trim() && title !== todo.title) {
      onEdit(title.trim());
    }
    setEditing(false);
  }
  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setEditing(false); setTitle(todo.title); }
  }
  return (
    <Row $complete={todo.isComplete}>
      <Checkbox 
        type="checkbox" 
        checked={todo.isComplete}
        aria-label={todo.isComplete ? 'Mark as incomplete' : 'Mark as complete'}
        onChange={onToggle}
      />
      {editing ? (
        <motion.div style={{flex: 1}} initial={{scale: 0.97}} animate={{scale: 1}}>
          <EditInput 
            ref={inputRef}
            value={title} 
            onChange={e => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKey}
            aria-label="Edit todo"
            autoFocus
          />
        </motion.div>
      ) : (
        <Title $complete={todo.isComplete} tabIndex={0} role="button" aria-label={`Edit: ${todo.title}`} onClick={() => setEditing(true)} onKeyDown={e => {if(e.key==='Enter'||e.key===' '){setEditing(true);}}}>{todo.title}</Title>
      )}
      <Delete onClick={onDelete} aria-label="Delete todo">✕</Delete>
    </Row>
  );
}