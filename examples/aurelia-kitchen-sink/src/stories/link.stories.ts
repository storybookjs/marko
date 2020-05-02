import { StoryFn } from '@storybook/addons';
import { withActions } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs } from '@storybook/addon-knobs';
import { addComponents, StoryFnAureliaReturnType } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';

export default {
  title: 'Link|Basic',
  decorators: [withKnobs, withActions],
};

export const customCoolButtonTest: StoryFn<Partial<StoryFnAureliaReturnType>> = () => ({
  template: `<button class="btn btn-outline-dark" click.delegate="buttonLink()">GO TO BUTTONS</button>`,
  state: {
    buttonLink: linkTo('Custom|Custom Elements', 'Auto Generate Knobs Story'),
  },
});
