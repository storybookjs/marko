import React from 'react';
import { styled } from '@storybook/theming';

export default {
  title: 'Addons/Toolbars',
};

const getCaptionForLocale = (locale) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'zh':
      return '你好!';
    case 'kr':
      return '안녕하세요!';
    case 'en':
    default:
      return 'Hello';
  }
};

const Themed = styled.div(({ theme }) => ({
  color: theme.color.defaultText,
  background: theme.background.content,
}));

export const Locale = (_args, { globals: { locale } }) => {
  return (
    <Themed style={{ fontSize: 30 }}>
      Your locale is '{locale}', so I say:
      <br />
      <Themed style={{ fontSize: 60, fontWeight: 'bold' }}>{getCaptionForLocale(locale)}</Themed>
    </Themed>
  );
};
