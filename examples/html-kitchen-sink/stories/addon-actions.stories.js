import { withActions } from '@storybook/addon-actions';

const buttonStory = () => () => `<button type="button">Hello World</button>`;

export default {
  title: 'Addons/Actions',
};

export const Story1 = buttonStory();
Story1.story = {
  name: 'Hello World',
  parameters: {
    actions: {
      handles: ['click'],
    },
  },
};

export const Story2 = buttonStory();
Story2.story = {
  name: 'Multiple actions',
  parameters: {
    actions: {
      handles: ['click', 'contextmenu'],
    },
  },
};

export const Story3 = buttonStory();
Story3.story = {
  name: 'Multiple actions + config',
  parameters: {
    actions: {
      handles: ['click', 'contextmenu', { clearOnStoryChange: false }],
    },
  },
};

export const Story4 = buttonStory();
Story4.story = {
  name: 'Multiple actions, object',
  parameters: {
    actions: {
      handles: [{ click: 'clicked', contextmenu: 'right clicked' }],
    },
  },
};

export const Story5 = () => `
        <div>
          Clicks on this button will be logged: <button class="btn" type="button">Button</button>
        </div>
      `;
Story5.story = {
  name: 'Multiple actions, selector',
  parameters: {
    actions: {
      handles: [{ 'click .btn': 'clicked', contextmenu: 'right clicked' }],
    },
  },
};

export const Story6 = buttonStory();
Story6.story = {
  name: 'Multiple actions, object + config',
  parameters: {
    actions: {
      handles: [{ click: 'clicked', contextmenu: 'right clicked' }, { clearOnStoryChange: false }],
    },
  },
};

export const DeprecatedDecoratorsStory1 = buttonStory();
DeprecatedDecoratorsStory1.story = {
  name: 'Deprecated decorators - Single action',
  decorators: [withActions('click')],
};

export const DeprecatedDecoratorsStory2 = buttonStory();
DeprecatedDecoratorsStory2.story = {
  name: 'Deprecated decorators - Multiple actions',
  decorators: [withActions('click', 'contextmenu')],
};

export const DeprecatedDecoratorsStory3 = buttonStory();
DeprecatedDecoratorsStory3.story = {
  name: 'Deprecated decorators - Multiple actions + config',
  decorators: [withActions('click', 'contextmenu', { clearOnStoryChange: false })],
};

export const DeprecatedDecoratorsStory4 = buttonStory();
DeprecatedDecoratorsStory4.story = {
  name: 'Deprecated decorators - Multiple actions, object',
  decorators: [withActions({ click: 'clicked', contextmenu: 'right clicked' })],
};
