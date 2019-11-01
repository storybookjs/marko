import { withKnobs, text } from '@storybook/addon-knobs';
import { linkTo } from '@storybook/addon-links';
import { addComponents, storiesOf } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/scss/bootstrap.scss';

storiesOf('Link|Basic', module)
  .addDecorator(withKnobs)
  .addDecorator(addComponents(CoolButton))
  .add('Aurelia - Template', function () {
    const buttonLink = linkTo('Button|Basic');
    return {
      template: `<button class="btn btn-outline-dark" click.delegate="buttonLink()">GO TO BUTTONS</button>`,
      state: {
        buttonLink,
      },
    };
  });