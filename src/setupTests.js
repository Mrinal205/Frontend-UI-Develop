import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';

configure({ adapter: new Adapter() });

// jest timezone mocks
const moment = require.requireActual('moment-timezone');
jest.doMock('moment', () => {
  moment.tz.setDefault('Europe/London');
  return moment;
});
