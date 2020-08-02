import React from 'react';
import { styled, withTheme } from '@storybook/theming';

import { StorybookLogo } from '@storybook/components';

export const StorybookLogoStyled = styled(StorybookLogo)({
  width: 'auto',
  height: '22px !important',
  display: 'block',
});

export const Img = styled.img({
  width: 'auto',
  height: 'auto',
  display: 'block',
  maxWidth: '100%',
});

export const LogoLink = styled.a({
  display: 'block',
  width: '100%',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

export const Brand = withTheme(
  ({
    theme: {
      brand: { title = 'Storybook', url = './', image },
    },
  }) => {
    const targetValue = url === './' ? '' : '_blank';
    if (image === undefined && url === null) {
      return <StorybookLogoStyled alt={title} />;
    }
    if (image === undefined && url) {
      return (
        <LogoLink title={title} href={url} target={targetValue}>
          <StorybookLogoStyled alt={title} />
        </LogoLink>
      );
    }
    if (image === null && url === null) {
      return title;
    }
    if (image === null && url) {
      return (
        <LogoLink href={url} target={targetValue} dangerouslySetInnerHTML={{ __html: title }} />
      );
    }
    if (image && url === null) {
      return <Img src={image} alt={title} />;
    }
    if (image && url) {
      return (
        <LogoLink title={title} href={url} target={targetValue}>
          <Img src={image} alt={title} />
        </LogoLink>
      );
    }
    return null;
  }
);
