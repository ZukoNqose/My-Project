import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from '@emotion/styled';

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
`;
const Input = styled.input`
  flex: 1 1 auto;
  padding: 0.55rem 0.7rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  border: 1px solid #bbb;
`;
const Button = styled.button`
  background: ${p => p.theme.colors.accent};
  color: #222;
  border: none;
  border-radius: 0.7rem;
  padding: 0 1.3rem;
  font-size: 1.04rem;
  font-weight: 500;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
interface Props {
  onAdd: (title: string) => void;
  loading?: boolean;
}
export function TodoInput({ onAdd, loading }: Props) {
  const [title, setTitle] = useState('');
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const val = title.trim();
    if (!val) return;
    onAdd(val);
    setTitle('');
  }
  return (
    <Form onSubmit={handleSubmit} aria-label="Add todo">
      <Input 
        type="text" 
        placeholder="Add a new todo..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-label="Todo title"
        disabled={loading}
        maxLength={120}
        required
      />
      <Button type="submit" disabled={loading || !title.trim()} aria-busy={loading}>{loading ? 'Adding...' : 'Add'}</Button>
    </Form>
  );
}
