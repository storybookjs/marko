import { withActions, decorate } from '@storybook/addon-actions';

const pickTarget = decorate([args => [args[0].target]]);

const button = () => {};

export default {
  title: 'Addons/Actions',
};

export const Story1 = () => withActions('click')(button);
Story1.story = {
  name: 'Hello World',
  parameters: {
    server: { id: 'addons/actions/story1' },
  },
};
export const Story2 = () => withActions('click', 'contextmenu')(button);
Story2.story = {
  name: 'Multiple actions',
  parameters: {
    server: { id: 'addons/actions/story2' },
  },
};

export const Story3 = () =>
  withActions('click', 'contextmenu', { clearOnStoryChange: false })(button);
Story3.story = {
  name: 'Multiple actions + config',
  parameters: {
    server: { id: 'addons/actions/story3' },
  },
};

export const Story4 = () => withActions({ click: 'clicked', contextmenu: 'right clicked' })(button);
Story4.story = {
  name: 'Multiple actions, object',
  parameters: {
    server: { id: 'addons/actions/story4' },
  },
};

export const Story5 = () =>
  withActions({ 'click .btn': 'clicked', contextmenu: 'right clicked' })(button);

Story5.story = {
  name: 'Multiple actions, selector',
  parameters: {
    server: { id: 'addons/actions/story5' },
  },
};

export const Story6 = () =>
  withActions(
    { click: 'clicked', contextmenu: 'right clicked' },
    { clearOnStoryChange: false }
  )(button);
Story6.story = {
  name: 'Multiple actions, object + config',
  parameters: {
    server: { id: 'addons/actions/story6' },
  },
};

export const Story7 = () => pickTarget.withActions('click', 'contextmenu')(button);
Story7.story = {
  name: 'Decorated actions',
  parameters: {
    server: { id: 'addons/actions/story7' },
  },
};

export const Story8 = () =>
  pickTarget.withActions('click', 'contextmenu', { clearOnStoryChange: false })(button);
Story8.story = {
  name: 'Decorated actions + config',
  parameters: {
    server: { id: 'addons/actions/story8' },
  },
};
