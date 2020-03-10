import React, { Fragment, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { ApplyWrappersProps, Wrapper } from './PreviewProps';

export const ApplyWrappers: FunctionComponent<ApplyWrappersProps> = ({
  wrappers,
  id,
  storyId,
  active,
  children,
}) => {
  return (
    <Fragment>
      {wrappers.reduceRight(
        (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
        children
      )}
    </Fragment>
  );
};

const IframeWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  background: theme.background.content,
}));
export const defaultWrappers = [
  {
    render: p => (
      <IframeWrapper id="storybook-preview-wrapper" hidden={!p.active}>
        {p.children}
      </IframeWrapper>
    ),
  } as Wrapper,
];
