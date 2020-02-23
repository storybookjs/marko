import { decorate } from '@storybook/addon-actions';
import { html } from 'lit-html';

const pickTarget = decorate([args => [args[0].target]]);

const buttonStory = () => () => html`<button type="button">Hello World</button>`

export default {
  title: 'Addons/Actions',
};

export const Story1 = buttonStory();
Story1.story = { 
  name: 'Hello World',
  parameters: {
    actions: {
      handles: ['click']
    }
  } 
};

export const Story2 = buttonStory();
Story2.story = { 
  name: 'Multiple actions',
  parameters: {
    actions: {
      handles: ['click', 'contextmenu']
    }
  }
};

export const Story3 = buttonStory();
Story3.story = { 
  name: 'Multiple actions + config',
  parameters: {
    actions: {
      handles: ['click', 'contextmenu', { clearOnStoryChange: false }]
    }
  }
};  

export const Story4 = buttonStory();
Story4.story = {
  name: 'Multiple actions, object',
  parameters: {
    actions: {
      handles: [{ click: 'clicked', contextmenu: 'right clicked' }]
    }
  }
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
      handles: [{ 'click .btn': 'clicked', contextmenu: 'right clicked' }]
    }
  } 
};

export const Story6 = buttonStory();
Story6.story = {
  name: 'Multiple actions, object + config',
  parameters: {
    actions: {
      handles: [
        { click: 'clicked', contextmenu: 'right clicked' },
        { clearOnStoryChange: false }
      ]
    }
  }  
};

export const Story7 = () => pickTarget.withActions('click', 'contextmenu')(buttonStory());
Story7.story = { name: 'Decorated actions' };

export const Story8 = () =>
  pickTarget.withActions('click', 'contextmenu', { clearOnStoryChange: false })(buttonStory());
Story8.story = { name: 'Decorated actions + config' };

export const Story9 = buttonStory()
Story9.story = { 
  name: 'Parameters array shortcut',
  parameters: {
    actions: [
      { click: 'clicked', contextmenu: 'right clicked' },
      { clearOnStoryChange: false }
    ]
  }  
};