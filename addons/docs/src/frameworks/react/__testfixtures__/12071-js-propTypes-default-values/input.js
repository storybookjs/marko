import React from 'react';
import PropTypes from 'prop-types';

import { imported } from './imported';

const local = 'local-value';

export const Tag = ({
  numberSet = 1,
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

Tag.propTypes = {
  numberSet: PropTypes.number.isRequired,
  numberUnset: PropTypes.number,
  stringSet: PropTypes.string.isRequired,
  stringUnset: PropTypes.string,
  booleanSet: PropTypes.bool.isRequired,
  booleanUnset: PropTypes.bool,
  arraySet: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  arrayUnset: PropTypes.arrayOf(PropTypes.string.isRequired),
  objectSet: PropTypes.shape({}).isRequired,
  objectUnset: PropTypes.shape({}),
  functionSet: PropTypes.func.isRequired,
  functionUnset: PropTypes.func,
  dateSet: PropTypes.instanceOf(Date).isRequired,
  dateUnset: PropTypes.instanceOf(Date),
  localReference: PropTypes.string.isRequired,
  importedReference: PropTypes.string.isRequired,
  globalReference: PropTypes.any.isRequired,
  stringGlobalName: PropTypes.string.isRequired,
};

export const component = Tag;
