import React, { FunctionComponent, useState, useEffect } from 'react';
import { styled } from '@storybook/theming';
import sizeMe from 'react-sizeme';

const Animated = styled.div({
  transition: 'height .2s ease-out',
  overflow: 'hidden',
});

const Animator: FunctionComponent<{
  size: {
    width: number;
    height: number;
  };
  setHeight: (height: number) => void;
}> = ({ size, setHeight, children }) => {
  useEffect(() => setHeight(size.height), [size.height]);

  return <div>{children}</div>;
};

const SizedApp = sizeMe({ monitorHeight: true })(Animator);

export const SmoothHeight: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
  children,
}) => {
  const [height, setHeight] = useState(initial);
  return (
    <Animated style={{ height }}>
      <SizedApp setHeight={setHeight}>{children}</SizedApp>
    </Animated>
  );
};
