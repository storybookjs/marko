import { text, withKnobs, } from '@storybook/addon-knobs';
import { StoryFnAureliaReturnType } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/scss/bootstrap.scss';
import { StoryFn } from '@storybook/addons';


export default {
  title: 'Custom|Custom Elements',
  decorators: [withKnobs],
};

export const customCoolButtonTest: StoryFn<Partial<StoryFnAureliaReturnType>> = () => ({ customElement: CoolButton });