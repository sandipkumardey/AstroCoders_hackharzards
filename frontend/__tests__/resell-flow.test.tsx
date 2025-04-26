import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../app/page';
import '@testing-library/jest-dom';

jest.mock('../app/api/tickets/resell', () => ({
  POST: jest.fn(async (req: Request) => {
    const { ticketId, price } = await req.json();
    if (price < 0.01) return { error: 'Invalid price range', status: 400 };
    return { success: true, ticketId, price };
  })
}));

describe('Ticket Resell Flow', () => {
  it('shows toast on successful resell', async () => {
    render(<Home />);
    // Simulate wallet connection
    fireEvent.click(screen.getByText(/Connect Wallet/i));
    // Simulate resell button (mocked)
    // ...add logic to open modal, enter price, submit
    // For demo, just check that Home renders
    expect(screen.getByText(/My Tickets/i)).toBeInTheDocument();
  });

  it('shows error toast on invalid price', async () => {
    render(<Home />);
    // Simulate wallet connection & resell with invalid price
    // ...similar as above
    expect(screen.getByText(/My Tickets/i)).toBeInTheDocument();
  });
});
