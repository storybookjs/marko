import React from 'react';
import { withTests as withTestsHOC } from '@storybook/addon-jest';

import results from './addon-jest.testresults.json';

export default {
  title: 'Addons/Jest',
  decorators: [withTestsHOC({ results })],
};

export const WithTests = () => <p>Hello</p>;
WithTests.parameters = { jest: 'addon-jest' };

export const WithInferredTests = () => <p>Inferred Tests</p>;

export const DisabledTests = () => <p>Disabled Tests</p>;
DisabledTests.parameters = { jest: { disabled: true } };
