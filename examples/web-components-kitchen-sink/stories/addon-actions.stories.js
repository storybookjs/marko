import { html } from 'lit-html';

const buttonStory = () => () => html` <button type="button">Hello World</button> `;

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
