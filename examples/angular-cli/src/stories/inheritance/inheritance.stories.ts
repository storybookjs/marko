import { IconButtonComponent } from './icon-button.component';
import { BaseButtonComponent } from './base-button.component';

export default {
  title: 'Custom/Inheritance',
};

export const IconButton = () => ({
  props: {
    icon: 'this is icon',
    label: 'this is label',
  },
});

IconButton.storyName = 'icon button';
IconButton.parameters = {
  component: IconButtonComponent,
};

export const BaseButton = () => ({
  props: {
    label: 'this is label',
  },
});

BaseButton.storyName = 'base button';
BaseButton.parameters = {
  component: BaseButtonComponent,
};
