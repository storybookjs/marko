import React from 'react';
import PropTypes from 'prop-types';

export const Tag = ({
  numberSet = 1,
  stringSet = 'stringSet',
  booleanSet = false,
  arraySet = ['array', 'set'],
  objectSet = { object: 'set' },
  // eslint-disable-next-line no-undef
  reference = window,
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
  reference: PropTypes.any.isRequired,
};

export const component = Tag;
