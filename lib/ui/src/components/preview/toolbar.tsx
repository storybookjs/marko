import React, { FunctionComponent, Fragment } from 'react';
import copy from 'copy-to-clipboard';

import { styled } from '@storybook/theming';

import { FlexBar, IconButton, Icons, Separator, TabButton, TabBar } from '@storybook/components';
import { Consumer, Combo } from '@storybook/api';
import { Addon } from '@storybook/addons';

import { stringifyQueryParams } from './stringifyQueryParams';
import { ZoomConsumer, Zoom } from './zoom';

import * as S from './components';

const Bar: FunctionComponent<{ shown: boolean } & Record<string, any>> = ({ shown, ...props }) => (
  <FlexBar {...props} />
);

export const Toolbar = styled(Bar)(
  {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    transition: 'transform .2s linear',
  },
  ({ shown }) => ({
    tranform: shown ? 'translateY(0px)' : 'translateY(-40px)',
  })
);

const fullScreenMapper = ({ api, state }: Combo) => ({
  toggle: api.toggleFullscreen,
  value: state.layout.isFullscreen,
});

export const fullScreenTool: Addon = {
  title: 'fullscreen',
  match: p => p.viewMode === 'story',
  render: () => (
    <Consumer filter={fullScreenMapper}>
      {({ toggle, value }) => (
        <S.DesktopOnly>
          <IconButton
            key="full"
            onClick={toggle as any}
            title={value ? 'Exit full screen' : 'Go full screen'}
          >
            <Icons icon={value ? 'close' : 'expand'} />
          </IconButton>
        </S.DesktopOnly>
      )}
    </Consumer>
  ),
};

const copyMapper = ({ state }: Combo) => ({
  origin: state.location.origin,
  pathname: state.location.pathname,
  storyId: state.storyId,
  baseUrl: 'iframe.html',
  queryParams: state.customQueryParams,
});

export const copyTool: Addon = {
  title: 'copy',
  match: p => p.viewMode === 'story',
  render: () => (
    <Consumer filter={copyMapper}>
      {({ baseUrl, storyId, origin, pathname, queryParams }) => (
        <IconButton
          key="copy"
          onClick={() =>
            copy(`${origin}${pathname}${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`)
          }
          title="Copy canvas link"
        >
          <Icons icon="copy" />
        </IconButton>
      )}
    </Consumer>
  ),
};

const ejectMapper = ({ state }: Combo) => ({
  baseUrl: 'iframe.html',
  storyId: state.storyId,
  queryParams: state.customQueryParams,
});

export const ejectTool: Addon = {
  title: 'eject',
  match: p => p.viewMode === 'story',
  render: () => (
    <Consumer filter={ejectMapper}>
      {({ baseUrl, storyId, queryParams }) => (
        <IconButton
          key="opener"
          href={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
          target="_blank"
          title="Open canvas in new tab"
        >
          <Icons icon="share" />
        </IconButton>
      )}
    </Consumer>
  ),
};

const zoomTool: Addon = {
  title: 'zoom',
  match: p => p.viewMode === 'story',
  render: () => (
    <Fragment>
      <ZoomConsumer>
        {({ set, value }) => (
          <Zoom key="zoom" set={(v: number) => set(value * v)} reset={() => set(1)} />
        )}
      </ZoomConsumer>
      <Separator />
    </Fragment>
  ),
};

const tabsMapper = ({ state }: Combo) => ({
  viewMode: state.docsOnly,
  storyId: state.storyId,
  path: state.path,
  location: state.location,
});

export const createTabsTool = (tabs: Addon[]): Addon => ({
  title: 'title',
  render: () => (
    <Consumer filter={tabsMapper}>
      {({ viewMode, storyId, path, location }) => (
        <Fragment>
          <TabBar key="tabs">
            {tabs
              .filter(p => !p.hidden)
              .map((t, index) => {
                const to = t.route({ storyId, viewMode, path, location });
                const isActive = path === to;
                return (
                  <S.UnstyledLink key={t.id || `l${index}`} to={to}>
                    <TabButton disabled={t.disabled} active={isActive}>
                      {t.title}
                    </TabButton>
                  </S.UnstyledLink>
                );
              })}
          </TabBar>
          <Separator />
        </Fragment>
      )}
    </Consumer>
  ),
});

export const defaultTools: Addon[] = [zoomTool];
export const defaultToolsExtra: Addon[] = [fullScreenTool, ejectTool, copyTool];
