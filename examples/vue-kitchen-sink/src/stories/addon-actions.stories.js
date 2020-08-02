import { action, actions } from '@storybook/addon-actions';

export default {
  title: 'Addon/Actions',
};

export const ActionOnly = () => ({
  template: '<my-button @click="log">Click me to log the action</my-button>',
  methods: {
    log: action('log1'),
  },
});

ActionOnly.storyName = 'Action only';

export const MultipleActions = () => ({
  template:
    '<my-button @click="click" @double-click="doubleclick">(Double) click me to log the action</my-button>',
  methods: actions('click', 'doubleclick'),
});

MultipleActions.storyName = 'Multiple actions';

export const MultipleActionsObject = () => ({
  template:
    '<my-button @click="click" @double-click="doubleclick">(Double) click me to log the action</my-button>',
  methods: actions({ click: 'clicked', doubleclick: 'double clicked' }),
});

MultipleActionsObject.storyName = 'Multiple actions, object';

export const ActionAndMethod = () => ({
  template: '<my-button @click="log">Click me to log the action</my-button>',
  methods: {
    log: (e) => {
      e.preventDefault();
      action('log2')(e.target);
    },
  },
});

ActionAndMethod.storyName = 'Action and method';
