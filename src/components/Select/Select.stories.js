import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Select from './Select';

storiesOf('Select', module)
  .add('primary', () => (
    <div>
      <Select onChange={action('onchange')} />
    </div>
  ))
  .add('large', () => (
    <div>
      <Select onChange={action('onchange')} size="large" />
    </div>
  ));
