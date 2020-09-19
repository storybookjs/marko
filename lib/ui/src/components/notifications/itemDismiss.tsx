import React, { FunctionComponent, SyntheticEvent } from 'react';
import { styled } from '@storybook/theming';
import { IconButton, Icons } from '@storybook/components';

const DismissButtonWrapper = styled(IconButton)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  color: theme.base === 'light' ? 'rgba(255,255,255,0.7)' : ' #999999',
}));

const DismissNotificationItem: FunctionComponent<{
  onClick: () => void;
}> = ({ onClick }) => (
  <div>
    <DismissButtonWrapper
      title="Dismiss notification"
      onClick={(e: SyntheticEvent) => {
        e.preventDefault();
        onClick();
      }}
    >
      <Icons icon="cross" height={12} width={12} />
    </DismissButtonWrapper>
  </div>
);

export default DismissNotificationItem;
