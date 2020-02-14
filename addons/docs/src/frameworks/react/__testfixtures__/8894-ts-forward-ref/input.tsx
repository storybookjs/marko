import React from 'react';
import styled from 'styled-components';

type Props = {
  pt?: number | string;
  p?: number | string;
};

const InnerBox: React.FC<Props> = props => <>{JSON.stringify(props)}</>;

/**
 * Use `Box` component to handle margins/paddings.
 */
export const Box: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  <InnerBox {...props} ref={ref} />
));

export const component = Box;
