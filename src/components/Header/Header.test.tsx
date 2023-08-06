import Header from '@/components/Header/Header';
import '@testing-library/jest-dom';
import { render, screen } from '@tests/utils';

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
  });
});
