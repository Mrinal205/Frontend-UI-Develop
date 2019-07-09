import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

storiesOf('Button', module)
  .add('primary', () => (
    <div>
      <Button onClick={action('clicked')}>Primary button</Button>
    </div>
  ))
  .add('danger', () => (
    <div>
      <Button danger>Danger button</Button>
    </div>
  ))
  .add('small size', () => (
    <div>
      <Button small>Small button</Button>
    </div>
  ))
  .add('outlined', () => (
    <div>
      <Button outlined>Outlined button</Button>
    </div>
  ))
  .add('block', () => (
    <div>
      <Button block>Block button (100% width)</Button>
    </div>
  ))
  .add('with loading state', () => (
    <div>
      <Button loading>Some action is in progress...</Button>
    </div>
  ));
