// Utilities for handling parameters
import mergeWith from 'lodash/mergeWith';

import { Parameters } from '@storybook/addons';

export const combineParameters = (...parameterSets: Parameters[]) =>
  mergeWith({}, ...parameterSets, (objValue: any, srcValue: any) => {
    // Treat arrays as scalars:
    if (Array.isArray(srcValue)) return srcValue;

    return undefined;
  });
