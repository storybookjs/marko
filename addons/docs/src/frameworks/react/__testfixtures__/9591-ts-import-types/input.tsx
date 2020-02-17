import React from 'react';
import { BarProps } from './Bar';

type OtherProps = BarProps & {
  other?: number;
};

const Other = (props: OtherProps) => <span {...props}>Other</span>;

export const component = Other;
