import window from 'global';
import React, { ReactElement, useEffect, useState } from 'react';
import { styled } from '@storybook/theming';

const browserSupportsCssZoom = (): boolean =>
  window.document.implementation.createHTMLDocument().body.style.zoom !== undefined;

const ZoomArea = styled.div<{ scale: number; height: number }>(({ scale = 1, height }) =>
  browserSupportsCssZoom()
    ? {
        zoom: 1 / scale,
      }
    : {
        height: height + 50,
        transformOrigin: 'top left',
        transform: `scale(${1 / scale})`,
      }
);

export interface IZoomProps {
  scale: number;
  children: ReactElement | ReactElement[];
}

export default function Zoom({ scale, children }: IZoomProps) {
  const componentWrapperRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (componentWrapperRef.current) {
      setHeight(componentWrapperRef.current.getBoundingClientRect().height);
    }
  }, [scale, componentWrapperRef.current]);

  return (
    <ZoomArea scale={scale} height={height}>
      <div ref={componentWrapperRef}>{children}</div>
    </ZoomArea>
  );
}
