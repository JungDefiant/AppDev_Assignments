import { render, screen } from '@testing-library/react';
import { ProfileCard } from './components/ProfileCard';

test('test 1', () => {
  render(<ProfileCard fullName={"Jane Doe"} />);
  const element = screen.getByText(/Name: Jane Doe/i);
  expect(element).toBeInTheDocument();
});

test('test 2', () => {
  render(<ProfileCard photoSrc={"https://example.com/user-photo.jpg"} />);
  const element = screen.getByAltText(/User Photo/i);
  expect(element.src).toBe("https://example.com/user-photo.jpg");
});

test('test 3', () => {
  render(<ProfileCard email={"jane.doe@email.com"} />);
  const element = screen.getByText(/Email: jane.doe@email.com/i);
  expect(element).toBeInTheDocument();
});

test('edge case 1: check for missing photo', () => {
  render(<ProfileCard />);
  const element = screen.getByAltText(/User Photo/i);
  expect(element.src).toBe('');
});

test('edge case 2: check for missing name', () => {
  render(<ProfileCard />);
  const element = screen.getByText(/Name:/i);
  expect(element).toBeInTheDocument();
});

test('edge case 3: check for missing email', () => {
  render(<ProfileCard />);
  const element = screen.getByText(/Email:/i);
  expect(element).toBeInTheDocument();
});
