import window from 'global';
import React, { useEffect, useState } from 'react';
import { styled } from '@storybook/theming';
import ZoomIFrame, { IZoomIFrameProps } from './ZoomIFrame';

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

export type ZoomProps = {
  scale: number;
} & Omit<IZoomIFrameProps, 'supportsCssZoom'>;

export function Zoom({ scale, children, src, title, allowFullScreen, active, id }: ZoomProps) {
  const componentWrapperRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (componentWrapperRef.current) {
      setHeight(componentWrapperRef.current.getBoundingClientRect().height);
    }
  }, [scale, componentWrapperRef.current]);

  return src ? (
    <ZoomIFrame
      src={src}
      title={title}
      allowFullScreen={allowFullScreen}
      active={active}
      supportsCssZoom={browserSupportsCssZoom()}
      scale={scale}
      id={id}
    >
      {children}
    </ZoomIFrame>
  ) : (
    <ZoomArea scale={scale} height={height}>
      <div ref={componentWrapperRef}>{children}</div>
    </ZoomArea>
  );
}

export default Zoom;
