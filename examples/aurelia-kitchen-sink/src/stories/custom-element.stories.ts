import { StoryFn } from '@storybook/addons';
import { withActions, action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { StoryFnAureliaReturnType, addComponents } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/scss/bootstrap.scss';

type StoryType = StoryFn<Partial<StoryFnAureliaReturnType>> & {
  story: { name: string };
};

export default {
  title: 'Custom|Custom Elements',
  decorators: [withKnobs, withActions, addComponents(CoolButton)],
};

export const SimpleCoolButtonStory: StoryType = () => ({
  template: `<cool-button click.delegate="buttonClick($event)" text.bind="buttonText"></cool-button>`,
  state: {
    buttonClick: action('Button Click'),
    buttonText: text('Button Text', 'Aurelia Rocks!'),
  },
});

SimpleCoolButtonStory.story = {
  name: 'Cool Button Story',
};

export const AutoGenerateStory: StoryType = () => ({
  customElement: CoolButton,
});

AutoGenerateStory.story = {
  name: 'Auto Generate Knobs Story',
};
