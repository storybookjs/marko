import { hbs } from 'ember-cli-htmlbars';
import { action } from '@storybook/addon-actions';

export default {
  title: 'welcome-banner',
  component: 'WelcomeBanner',
  parameters: {
    docs: {
      iframeHeight: 200,
    },
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    subTitleColor: { control: 'color' },
  },
};

export const Basic = (args) => ({
  template: hbs`
      {{welcome-banner
        backgroundColor=backgroundColor
        titleColor=titleColor
        subTitleColor=subTitleColor
        title=title
        subtitle=subtitle
        click=(action onClick)
      }}
    `,
  context: args,
});
Basic.args = {
  backgroundColor: '#FDF4E7',
  titleColor: '#DF4D37',
  subTitleColor: '#B8854F',
  title: 'Welcome to storybook',
  subtitle: 'This environment is completely editable',
  onClick: action('clicked'),
};
