import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Mock map topology fetch
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({})
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders app title', async () => {
  render(<App />);
  const title = await screen.findByText(/Economic Blocs Map/i);
  expect(title).toBeInTheDocument();
});
