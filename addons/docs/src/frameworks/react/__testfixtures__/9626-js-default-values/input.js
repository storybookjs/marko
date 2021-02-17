/* eslint-disable react/prop-types */

import React from 'react';

import { imported } from './imported';

const local = 'local-value';

export const Tag = ({
  numberSet = 1,
  numberUnset, // Note this does *not* get detected
  stringSet = 'stringSet',
  booleanSet = false,
  arraySet = ['array', 'set'],
  objectSet = { object: 'set' },
  functionSet = () => 'foo',
  dateSet = new Date(),
  localReference = local,
  importedReference = imported,
  globalReference = Date,
  stringGlobalName = 'top',
}) => <div>Tag</div>;
export const component = Tag;
