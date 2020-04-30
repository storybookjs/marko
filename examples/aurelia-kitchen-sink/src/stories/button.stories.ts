import { withKnobs, text } from '@storybook/addon-knobs';
import { action, withActions } from '@storybook/addon-actions';
import { addComponents, storiesOf } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/scss/bootstrap.scss';

storiesOf('Button|Basic', module)
  .addDecorator(withKnobs)
  .addDecorator(withActions)
  .addDecorator(addComponents(CoolButton))
  .add('Aurelia - Template', function () {
    const buttonText = text('Button Text', 'Aurelia Rocks!');
    const buttonClick = action('Button Click');
    const state = {
      buttonText,
      buttonClick,
    };
    return {
      template: `<cool-button click.delegate="buttonClick($event)" text.bind="buttonText"></cool-button>`,
      state,
    };
  })
  .add('Aurelia - Auto Generate', function () {
    return {
      customElement: CoolButton,
    };
  });
