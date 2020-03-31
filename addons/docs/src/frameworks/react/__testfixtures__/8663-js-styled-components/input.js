import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Box = styled.div`
  background-color: ${(props) => props.bg};
`;

Box.propTypes = {
  bg: PropTypes.string,
};

export const MyBox = (props) => <Box {...props} />;

MyBox.propTypes = {
  // eslint-disable-next-line react/require-default-props
  bg: PropTypes.string,
};

export const component = MyBox;
