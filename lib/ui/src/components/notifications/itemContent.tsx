import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { State } from '@storybook/api';
import BookIcon from './assets/book.svg';

const NotificationIconWrapper = styled.div(() => ({
  margin: '0 5px 0 0',
  display: 'flex',
}));

const NotificationTextWrapper = styled.div(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Headline = styled.div(({ theme }) => ({
  color: theme.base === 'light' ? '#fff' : '#333333',
  fontSize: 12,
  lineHeight: '14px',
  fontWeight: 'bold',
}));

const SubHeadline = styled.div(({ theme }) => ({
  color: theme.base === 'light' ? 'rgba(255,255,255,0.7)' : ' #999999',
  fontSize: 11,
  lineHeight: 1,
}));

const truncateLongHeadlines = (headline: string, length = 36) =>
  headline.length > length ? `${headline.substr(0, length - 1)}…` : headline;

const ItemContent: FunctionComponent<Pick<
  State['notifications'][0],
  'showBookIcon' | 'content'
>> = ({ showBookIcon = false, content: { headline, subHeadline } }) => (
  <>
    {!showBookIcon || (
      <NotificationIconWrapper>
        <img src={BookIcon} alt="" />
      </NotificationIconWrapper>
    )}
    <NotificationTextWrapper>
      <Headline title={headline}>{truncateLongHeadlines(headline)}</Headline>
      {<SubHeadline>{subHeadline}</SubHeadline> && subHeadline}
    </NotificationTextWrapper>
  </>
);

export default ItemContent;
