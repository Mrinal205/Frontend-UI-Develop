import React from 'react';
import { storiesOf } from '@storybook/react';

import { HelpTip } from './HelpTip';

storiesOf('HelpTip', module)
  .add('default', () => {
    return (
      <div style={{ padding: '10rem' }}>
        <HelpTip>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ratione laborum
            numquam mollitia rem sed aspernatur quia molestiae nisi aperiam qui est voluptatibus
            dolores magnam, accusamus obcaecati neque dolore nobis!
          </p>
        </HelpTip>
      </div>
    );
  })
  .add('with custom handle', () => {
    return (
      <div style={{ padding: '10rem' }}>
        <HelpTip handle={<span>•</span>}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ratione laborum
            numquam mollitia rem sed aspernatur quia molestiae nisi aperiam qui est voluptatibus
            dolores magnam, accusamus obcaecati neque dolore nobis!
          </p>
        </HelpTip>
      </div>
    );
  });
