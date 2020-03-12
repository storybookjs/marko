import React from 'react';
import { storiesOf } from '@storybook/react';
import { Loader } from './Loader';

storiesOf('Basics/Loader', module)
  .addDecorator(storyFn => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background:
          'linear-gradient(to right, rgba(56,56,56,1) 0%, rgba(0,0,0,1) 50%, rgba(255,255,255,1) 50%, rgba(224,224,224,1) 100%)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          height: '50vh',
          width: '100vw',
          background:
            'linear-gradient(to right, red 0%, orangered 50%, blue 50%, deepskyblue 100%)',
        }}
      />
      {storyFn()}
    </div>
  ))
  .add('infinite state', () => <Loader role="progressbar" />)
  .add('size adjusted', () => <Loader size={64} role="progressbar" />);
