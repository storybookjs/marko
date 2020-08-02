import { withActions } from '@storybook/addon-actions';

const buttonStory = () => () => `<button type="button">Hello World</button>`;

export default {
  title: 'Addons/Actions',
};

export const Story1 = buttonStory();
Story1.storyName = 'Hello World';

Story1.parameters = {
  actions: {
    handles: ['click'],
  },
};

export const Story2 = buttonStory();
Story2.storyName = 'Multiple actions';

Story2.parameters = {
  actions: {
    handles: ['click', 'contextmenu'],
  },
};

export const Story3 = buttonStory();
Story3.storyName = 'Multiple actions + config';

Story3.parameters = {
  actions: {
    handles: ['click', 'contextmenu', { clearOnStoryChange: false }],
  },
};

export const Story4 = buttonStory();
Story4.storyName = 'Multiple actions, object';

Story4.parameters = {
  actions: {
    handles: [{ click: 'clicked', contextmenu: 'right clicked' }],
  },
};

export const Story5 = () => `
        <div>
          Clicks on this button will be logged: <button class="btn" type="button">Button</button>
        </div>
      `;
Story5.storyName = 'Multiple actions, selector';

Story5.parameters = {
  actions: {
    handles: [{ 'click .btn': 'clicked', contextmenu: 'right clicked' }],
  },
};

export const Story6 = buttonStory();
Story6.storyName = 'Multiple actions, object + config';

Story6.parameters = {
  actions: {
    handles: [{ click: 'clicked', contextmenu: 'right clicked' }, { clearOnStoryChange: false }],
  },
};

export const DeprecatedDecoratorsStory1 = buttonStory();
DeprecatedDecoratorsStory1.storyName = 'Deprecated decorators - Single action';
DeprecatedDecoratorsStory1.decorators = [withActions('click')];

export const DeprecatedDecoratorsStory2 = buttonStory();
DeprecatedDecoratorsStory2.storyName = 'Deprecated decorators - Multiple actions';
DeprecatedDecoratorsStory2.decorators = [withActions('click', 'contextmenu')];

export const DeprecatedDecoratorsStory3 = buttonStory();
DeprecatedDecoratorsStory3.storyName = 'Deprecated decorators - Multiple actions + config';
DeprecatedDecoratorsStory3.decorators = [
  withActions('click', 'contextmenu', { clearOnStoryChange: false }),
];

export const DeprecatedDecoratorsStory4 = buttonStory();
DeprecatedDecoratorsStory4.storyName = 'Deprecated decorators - Multiple actions, object';
DeprecatedDecoratorsStory4.decorators = [
  withActions({ click: 'clicked', contextmenu: 'right clicked' }),
];
