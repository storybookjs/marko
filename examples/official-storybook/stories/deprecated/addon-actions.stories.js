import React from 'react';
import { decorateAction } from '@storybook/addon-actions';
import { Form } from '@storybook/components';

const { Button } = Form;

const pickNativeAction = decorateAction([args => [args[0].nativeEvent]]);

export default {
  title: 'Addons/Actions/deprecated',
};

export const DecoratedAction = () => (
  <Button onClick={pickNativeAction('decorated')}>Native Event</Button>
);

DecoratedAction.story = {
  name: 'Decorated Action',
};
