import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';


const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  it('renders the home page by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Discover the Coast/i)).toBeInTheDocument();
  });

});