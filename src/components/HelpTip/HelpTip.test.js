import React from 'react';
import { shallow } from 'enzyme';
import { HelpTip } from './HelpTip';

it('renders <HelpTip /> component without crashing', () => {
  const wrapper = shallow(
    <HelpTip>
      <p>Lorem ipsum...</p>
    </HelpTip>
  );
  expect(wrapper).toBeDefined();
});
