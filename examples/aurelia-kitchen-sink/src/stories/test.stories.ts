import { storiesOf } from '@storybook/aurelia';
import { customElement } from '@aurelia/runtime';


@customElement({ name: 'TEST', template: '<button>asdfasdf</button>' })
class Button {

}

storiesOf('Button|Basic', module).add('Simple', () => Button);