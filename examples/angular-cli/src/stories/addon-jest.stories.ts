import { withTests } from '@storybook/addon-jest';

import { AppComponent } from '../app/app.component';
import * as results from '../../addon-jest.testresults.json';

export default {
  title: 'Addon/Jest',
  decorators: [
    withTests({
      results,
      filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
    }),
  ],
};

export const AppComponentWithJestTests = () => ({
  component: AppComponent,
  props: {},
});

AppComponentWithJestTests.storyName = 'app.component with jest tests';

AppComponentWithJestTests.parameters = {
  jest: 'app.component',
};
