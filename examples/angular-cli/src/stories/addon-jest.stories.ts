import { withTests } from '@storybook/addon-jest';

import { AppComponent } from '../app/app.component';
import * as results from '../../addon-jest.testresults.json';

export default {
  title: 'Addon/Jest',
  component: AppComponent,
  decorators: [
    withTests({
      results,
      filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
    }),
  ],
};

export const AppComponentWithJestTests = () => ({
  props: {},
});

AppComponentWithJestTests.storyName = 'app.component with jest tests';

AppComponentWithJestTests.parameters = {
  jest: 'app.component',
};
