import styled from '@emotion/styled';

const Bar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 0.9rem;
`;
const Button = styled.button<{active:boolean}>`
  background: none;
  border: none;
  color: ${p => p.active ? p.theme.colors.accent : p.theme.colors.primary};
  font-weight: ${p => p.active ? 700 : 500};
  font-size: 1rem;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 2px solid ${p => p.active ? p.theme.colors.accent : 'transparent'};
  outline: none;
  transition: color 0.14s, border 0.14s;
`;
interface Props {
  value: 'all'|'active'|'completed';
  setValue: (v: 'all'|'active'|'completed') => void;
}
export function FilterBar({ value, setValue }: Props) {
  return (
    <Bar role="tablist" aria-label="Filter todos">
      <Button type="button" active={value==='all'} role="tab" aria-selected={value==='all'} tabIndex={0} onClick={() => setValue('all')}>All</Button>
      <Button type="button" active={value==='active'} role="tab" aria-selected={value==='active'} tabIndex={0} onClick={() => setValue('active')}>Active</Button>
      <Button type="button" active={value==='completed'} role="tab" aria-selected={value==='completed'} tabIndex={0} onClick={() => setValue('completed')}>Completed</Button>
    </Bar>
  );
}
