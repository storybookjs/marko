import { storiesOf } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';
import { addComponents } from '@storybook/aurelia/dist/client/preview/decorators';

storiesOf('Button|Basic', module)
    .addDecorator(addComponents(CoolButton))
    .add('Cool', () => ({ container: undefined, customElement: undefined, items: undefined, template: '<template>asdfasdfasdfas<cool-button></cool-button></template>' }), null)
    .add('Test', () => ({ container: undefined, customElement: undefined, items: undefined, template: '<template>asdfasdfasdfas<test-button></test-button></template>' }), null);
