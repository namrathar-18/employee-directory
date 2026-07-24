import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DepartmentBadge, StatusBadge } from './Badge';

describe('Badge', () => {
  it('renders the department name', () => {
    render(<DepartmentBadge department="Engineering" />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('renders the employee status', () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
