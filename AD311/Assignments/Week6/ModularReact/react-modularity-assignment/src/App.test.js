import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const element = screen.getByText(/This is the Header./i);
  expect(element).toBeInTheDocument();
});

test('renders footer', () => {
  render(<App />);
  const element = screen.getByText(/This is the Footer./i);
  expect(element).toBeInTheDocument();
});

test('renders content b', () => {
  render(<App />);
  const element = screen.getByText(/Behold, Big Chungus./i);
  expect(element).toBeInTheDocument();
});

test('edge case 1: check for missing image src', () => {
  render(<App />);
  const element = screen.getByAltText(/Obese Bugs Bunny/i);
  expect(element.src).not.toBe('');
});

test('edge case 2: check for missing button', () => {
  render(<App />);
  const element = screen.getByText(/Test Button/i);
  expect(element).toBeInTheDocument();
});

test('edge case 3: content b is rendered as heading', () => {
  render(<App />);
  const element = screen.getByText(/Behold, Big Chungus./i);
  expect(element.tagName).toBe('H2');
});
