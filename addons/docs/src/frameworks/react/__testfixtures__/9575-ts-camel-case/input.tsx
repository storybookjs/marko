import PropTypes from 'prop-types';
import React, { FC } from 'react';

export interface IProps {
  /**
   * button color
   */
  color?: string;
}

const iconButton: FC<IProps> = function IconButton(props) {
  return <div className="icon-button">icon-button</div>;
};

iconButton.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  color: PropTypes.string,
};

iconButton.defaultProps = {
  color: 'primary',
};

export default iconButton;
export const component = iconButton;
