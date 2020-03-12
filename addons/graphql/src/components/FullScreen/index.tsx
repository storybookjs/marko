import React, { FunctionComponent } from 'react';
import { style } from './style';

export const FullScreen: FunctionComponent = ({ children }) => {
  return <div style={style.wrapper}>{children}</div>;
};
