import { useMemo, useState } from 'react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos.js';
import { TodoInput } from './TodoInput';
import { FilterBar } from './FilterBar';
import { AnimatePresence, motion } from 'framer-motion';
import styled from '@emotion/styled';
import { TodoRow } from './TodoRow';

const Container = styled.main`
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
`;
const Title = styled.h1`
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0 0;
`;

export function TodoList() {
  const { data: todos = [], isLoading, isError, error } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const [filter, setFilter] = useState<'all'|'active'|'completed'>('all');

  const filteredTodos = useMemo(() => {
    if (filter === 'all') return todos;
    if (filter === 'active') return todos.filter(t => !t.isComplete);
    return todos.filter(t => t.isComplete);
  }, [todos, filter]);

  return (
    <Container aria-label='Todo App'>
      <Title>Todo List</Title>
      <TodoInput onAdd={t => createTodo.mutate({ title: t, isComplete: false })} loading={createTodo.isPending} />
      <FilterBar value={filter} setValue={setFilter} />
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p role="alert">{(error as Error)?.message || 'Error loading todos.'}</p>
      ) : (
        <List>
          <AnimatePresence>
          {filteredTodos.map(todo => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.19 }}
            >
              <TodoRow
                todo={todo}
                onToggle={() => updateTodo.mutate({ ...todo, isComplete: !todo.isComplete, id: todo.id })}
                onEdit={title => updateTodo.mutate({ ...todo, title })}
                onDelete={() => deleteTodo.mutate(todo.id)}
              />
            </motion.li>
          ))}
          </AnimatePresence>
        </List>
      )}
    </Container>
  );
}
