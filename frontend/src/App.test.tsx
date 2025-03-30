import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Todo Uygulaması header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Todo Uygulaması/i);
  expect(headerElement).toBeInTheDocument();
});