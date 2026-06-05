import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from './App';

describe('App', () => {
  test('renders the trading journal dashboard shell', () => {
    render(<App />);

    expect(screen.getAllByText(/R0TK Journal/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Add Trade/i })).toBeTruthy();
    expect(screen.getByText(/Security Monitor/i)).toBeTruthy();
  });
});
