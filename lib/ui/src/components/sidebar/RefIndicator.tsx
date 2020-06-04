import React, { FunctionComponent, useMemo, ComponentProps, useCallback, forwardRef } from 'react';

import { Icons, WithTooltip, Spaced, TooltipLinkList } from '@storybook/components';
import { styled } from '@storybook/theming';
import { useStorybookApi } from '@storybook/api';

import { getStateType, RefType } from './RefHelpers';
import { MenuItemIcon } from './Menu';

export type ClickHandler = ComponentProps<typeof TooltipLinkList>['links'][number]['onClick'];
export interface IndicatorIconProps {
  type: ReturnType<typeof getStateType>;
}
export interface CurrentVersionProps {
  url: string;
  versions: RefType['versions'];
}

const IndicatorPlacement = styled.aside(
  ({ theme }) => ({
    height: 14,
    display: 'flex',

    '& > * + *': {
      marginLeft: theme.layoutMargin,
    },
  }),
  ({ theme }) => ({ color: theme.color.mediumdark })
);

const IndicatorIcon: FunctionComponent<IndicatorIconProps> = ({ type }) => {
  let icon: ComponentProps<typeof Icons>['icon'];

  switch (true) {
    case type === 'error': {
      icon = 'alert';
      break;
    }
    default: {
      icon = 'globe';
    }
  }

  return <Icons width="14" height="14" icon={icon} />;
};

const Message = styled.a(({ theme }) => ({
  textDecoration: 'none',
  lineHeight: '18px',
  padding: 10,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  color: theme.color.darker,
  '&:hover': {
    background: theme.background.hoverable,
    color: theme.color.darker,
  },
  '&:link': {
    color: theme.color.darker,
  },
  '&:active': {
    color: theme.color.darker,
  },
  '&:focus': {
    color: theme.color.darker,
  },
  '& > *': {
    flex: 1,
  },
  '& > svg': {
    marginTop: 5,
    width: 20,
    marginRight: 10,
    flex: 'unset',
  },
}));

export const MessageWrapper = styled.div({
  width: 280,
  boxSizing: 'border-box',
  borderRadius: 8,
  overflow: 'hidden',
});

const BlueIcon = styled(Icons)(({ theme }) => ({
  color: theme.color.secondary,
}));

const YellowIcon = styled(Icons)(({ theme }) => ({
  color: theme.color.gold,
}));

const Version = styled.div({
  display: 'flex',
  alignItems: 'center',
  fontSize: 11,

  '& > * + *': {
    marginLeft: 4,
  },
});

const CurrentVersion: FunctionComponent<CurrentVersionProps> = ({ url, versions }) => {
  const currentVersionId = useMemo(() => Object.entries(versions).find(([k, v]) => v === url)[0], [
    url,
    versions,
  ]);

  return (
    <Version>
      <span>{currentVersionId}</span>
      <Icons width="12" height="12" icon="chevrondown" />
    </Version>
  );
};

export const RefIndicator = forwardRef<
  HTMLElement,
  RefType & {
    state: ReturnType<typeof getStateType>;
  }
>(({ state, ...ref }, forwardedRef) => {
  const api = useStorybookApi();
  const list = useMemo(() => Object.values(ref.stories || {}), [ref.stories]);
  const componentCount = useMemo(() => list.filter((v) => v.isComponent).length, [list]);
  const leafCount = useMemo(() => list.filter((v) => v.isLeaf).length, [list]);

  const changeVersion = useCallback(
    ((event, item) => {
      event.preventDefault();
      api.changeRefVersion(ref.id, item.href);
    }) as ClickHandler,
    []
  );

  return (
    <IndicatorPlacement ref={forwardedRef}>
      <WithTooltip
        placement="bottom-start"
        trigger="click"
        tooltip={
          <MessageWrapper>
            <Spaced row={0}>
              {state === 'loading' && <LoadingMessage url={ref.url} />}
              {state === 'ready' && (
                <ReadyMessage {...{ url: ref.url, componentCount, leafCount }} />
              )}
              {ref.type === 'auto-inject' && state !== 'error' && <PerformanceDegradedMessage />}
              {state === 'error' && <ErrorOccurredMessage />}
            </Spaced>
          </MessageWrapper>
        }
      >
        <IndicatorIcon type={state} />
      </WithTooltip>

      {ref.versions ? (
        <WithTooltip
          placement="bottom-start"
          trigger="click"
          tooltip={
            <TooltipLinkList
              links={Object.entries(ref.versions).map(([id, href]) => ({
                left: href === ref.url ? <MenuItemIcon icon="check" /> : <span />,
                id,
                title: id,
                href,
                onClick: changeVersion,
              }))}
            />
          }
        >
          <CurrentVersion url={ref.url} versions={ref.versions} />
        </WithTooltip>
      ) : null}
    </IndicatorPlacement>
  );
});

const PerformanceDegradedMessage: FunctionComponent = () => (
  <Message href="https://storybook.js.org" target="_blank">
    <YellowIcon icon="lightning" />
    <div>
      <strong>Reduce lag</strong>
      <div>Learn how to speed up Storybook Composition performance</div>
    </div>
  </Message>
);

const ErrorOccurredMessage: FunctionComponent = () => (
  <Message href="https://storybook.js.org" target="_blank">
    <YellowIcon icon="book" />
    <div>
      <strong>A problem occurred</strong>
      <div>Explore the documentation</div>
    </div>
  </Message>
);

const ReadyMessage: FunctionComponent<{
  url: string;
  componentCount: number;
  leafCount: number;
}> = ({ url, componentCount, leafCount }) => (
  <Message href={url} target="_blank">
    <BlueIcon icon="globe" />
    <div>
      <strong>View external storybook</strong>
      <div>
        Explore {componentCount} components and {leafCount} stories in a new browser tab
      </div>
    </div>
  </Message>
);

const LoadingMessage: FunctionComponent<{ url: string }> = ({ url }) => (
  <Message href={url} target="_blank">
    <BlueIcon icon="time" />
    <div>
      <strong>Please wait</strong>
      <div>This storybook is being loaded, explore in a new browser tab</div>
    </div>
  </Message>
);
