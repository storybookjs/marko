import window from 'global';
import React, { Component, CSSProperties, IframeHTMLAttributes } from 'react';

import { styled } from '@storybook/theming';

const FIREFOX_BROWSER = 'Firefox';

const StyledIframe = styled.iframe({
  position: 'absolute',
  display: 'block',
  boxSizing: 'content-box',
  height: '100%',
  width: '100%',
  border: '0 none',
  transition: 'all .3s, background-position 0s',
  backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
});

export interface IFrameProps {
  id: string;
  title: string;
  src: string;
  allowFullScreen: boolean;
  scale: number;
}

export class IFrame extends Component<IFrameProps & IframeHTMLAttributes<HTMLIFrameElement>> {
  iframe: HTMLIFrameElement = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
  }

  shouldComponentUpdate(nextProps: IFrameProps) {
    const { scale } = this.props;
    if (scale !== nextProps.scale) {
      if (window.navigator.userAgent.indexOf(FIREFOX_BROWSER) !== -1) {
        this.setIframeBodyStyle({
          width: `${nextProps.scale * 100}%`,
          height: `${nextProps.scale * 100}%`,
          transform: `scale(${1 / nextProps.scale})`,
          transformOrigin: 'top left',
        });
      } else {
        this.setIframeBodyStyle({
          zoom: 1 / nextProps.scale,
        });
      }
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    return false;
  }

  setIframeBodyStyle(style: CSSProperties) {
    return Object.assign(this.iframe.contentDocument.body.style, style);
  }

  render() {
    const { id, title, src, allowFullScreen, scale, ...rest } = this.props;
    return (
      <StyledIframe
        scrolling="yes"
        id={id}
        title={title}
        src={src}
        allowFullScreen={allowFullScreen}
        {...rest}
      />
    );
  }
}
