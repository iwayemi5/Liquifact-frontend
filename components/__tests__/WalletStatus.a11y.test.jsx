import { render } from '@testing-library/react';
import WalletStatus from '../WalletStatus';
import { axe } from 'jest-axe';

test('WalletStatus has no accessibility violations', async () => {
  const { container } = render(<WalletStatus />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
