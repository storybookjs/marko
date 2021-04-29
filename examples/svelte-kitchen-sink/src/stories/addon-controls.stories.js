import ControlShowcaseView from './views/ControlShowcaseView.svelte';

export default {
  title: 'Addon/Controls',
  component: ControlShowcaseView,
  argTypes: {
    range: { defaultValue: 0, control: { type: 'range', min: 0, max: 100 } },
    loadingState: {
      control: {
        type: 'inline-radio',
        options: ['loading', 'error', 'ready'],
      },
    },
    food: {
      control: {
        type: 'inline-check',
        options: ['apple', 'banana', 'orange'],
      },
    },
    car: {
      control: {
        type: 'select',
        options: ['Truck', 'SUV', 'Tesla'],
      },
    },
    color: {
      control: 'color',
    },
    date: {
      control: 'date',
    },
  },
};

export const ShowCase = (args) => ({
  Component: ControlShowcaseView,
  props: args,
});
