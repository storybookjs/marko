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

export const LogoLink = styled.a(({ theme }) => ({
  display: 'inline-block',
  height: '100%',
  margin: '-3px -4px',
  padding: '2px 3px',
  border: '1px solid transparent',
  borderRadius: 3,
  color: 'inherit',
  textDecoration: 'none',
  '&:focus': {
    outline: 0,
    borderColor: theme.color.secondary,
  },
}));

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
