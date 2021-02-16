/* eslint-disable react/prop-types */

import React from 'react';

export const Tag = ({
  numberSet = 1,
  numberUnset, // Note this does *not* get detected
  stringSet = 'stringSet',
  booleanSet = false,
  arraySet = ['array', 'set'],
  objectSet = { object: 'set' },
  // eslint-disable-next-line no-undef
  reference = window,
}) => <div>Tag</div>;
export const component = Tag;
