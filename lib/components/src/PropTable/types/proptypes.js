import PropTypes from 'prop-types';

export const TypeInfo = PropTypes.oneOfType([
  PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }),
  PropTypes.string,
]);

export const getPropTypes = propType =>
  typeof propType === 'string' ? propType : propType.value || propType.elements;
