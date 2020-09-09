import window from 'global';
import React, { Component, IframeHTMLAttributes } from 'react';

import { styled } from '@storybook/theming';

const FIREFOX_BROWSER = 'Firefox';

const StyledIframe = styled.iframe({
  position: 'absolute',
  display: 'block',
  boxSizing: 'content-box',
  height: '100%',
  width: '100%',
  border: '0 none',
  transition: 'all .3s, background-position 0s, visibility 0s',
  backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
});

export interface IFrameProps {
  id: string;
  title: string;
  src: string;
  allowFullScreen: boolean;
  scale: number;
  active: boolean;
}

export class IFrame extends Component<IFrameProps & IframeHTMLAttributes<HTMLIFrameElement>> {
  iframe: HTMLIFrameElement = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
  }

  shouldComponentUpdate(nextProps: IFrameProps) {
    const { scale, active } = this.props;

    if (scale !== nextProps.scale) {
      this.setIframeInnerZoom(nextProps.scale);
    }

    if (active !== nextProps.active) {
      this.iframe.setAttribute('data-is-storybook', nextProps.active ? 'true' : 'false');
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    return false;
  }

  setIframeInnerZoom(scale: number) {
    try {
      if (window.navigator.userAgent.indexOf(FIREFOX_BROWSER) !== -1) {
        Object.assign(this.iframe.contentDocument.body.style, {
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          transform: `scale(${1 / scale})`,
          transformOrigin: 'top left',
        });
      } else {
        Object.assign(this.iframe.contentDocument.body.style, {
          zoom: 1 / scale,
        });
      }
    } catch (e) {
      this.setIframeZoom(scale);
    }
  }

  setIframeZoom(scale: number) {
    Object.assign(this.iframe.style, {
      width: `${scale * 100}%`,
      height: `${scale * 100}%`,
      transform: `scale(${1 / scale})`,
      transformOrigin: 'top left',
    });
  }

  render() {
    const { id, title, src, allowFullScreen, scale, active, ...rest } = this.props;
    return (
      <StyledIframe
        onLoad={() => this.iframe.setAttribute('data-is-loaded', 'true')}
        data-is-storybook={active ? 'true' : 'false'}
        id={id}
        title={title}
        src={src}
        allowFullScreen={allowFullScreen}
        {...rest}
      />
    );
  }
}
