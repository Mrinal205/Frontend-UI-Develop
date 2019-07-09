import { initialize } from './index';
import ReactDOM from 'react-dom';

jest.mock('react-dom', () => ({ render: jest.fn() }));

describe('Application entry point (index.js)', () => {
  it('Initializes without error', () => {
    initialize('moon-assist-root');
  });
});
