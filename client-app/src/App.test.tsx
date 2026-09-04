import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the dashboard header', () => {
    render(<App />);
    const headerElement = screen.getByText(/PrankDeck AI Dashboard/i);
    expect(headerElement).toBeInTheDocument();
  });

  it('renders the soundboard grid sections', () => {
    render(<App />);
    expect(screen.getByText('GREETINGS')).toBeInTheDocument();
    expect(screen.getByText('ACCUSATIONS')).toBeInTheDocument();
  });

  it('triggers a soundboard block correctly', () => {
    render(<App />);
    const helloButton = screen.getByText('Hello?');
    fireEvent.click(helloButton);
    expect(screen.getByText('Last Triggered: Hello?')).toBeInTheDocument();
  });
});
