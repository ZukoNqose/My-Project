import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, Global, css } from '@emotion/react';
import { TodoList } from './components/TodoList';

const queryClient = new QueryClient();

const theme = {
  colors: { primary: '#282c34', accent: '#61dafb', gray: '#bbb', white: '#fff', completed: '#41b06e' }
};

const globalStyles = css`
  html, body, #root {
    min-height: 100vh;
    background: #f7fafc;
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: #222;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
