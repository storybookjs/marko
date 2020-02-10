import window from 'global';
import React, { Fragment } from 'react';
import memoize from 'memoizerific';
import copy from 'copy-to-clipboard';
import { State, API } from '@storybook/api';
import { types, Addon } from '@storybook/addons';
import { Icons, IconButton, TabButton, TabBar, Separator } from '@storybook/components';
import { ZoomConsumer, Zoom } from './zoom';
import { getElementList, DesktopOnly, stringifyQueryParams } from './preview';

import * as S from './components';

export const getTools = memoize(10)(
  (
    getElements: API['getElements'],
    queryParams: State['customQueryParams'],
    panels: Partial<Addon>[],
    api: API,
    options,
    storyId: string,
    viewMode: State['viewMode'],
    docsOnly: boolean,
    location: State['location'],
    path: string,
    baseUrl: string
  ) => {
    const tools = getElementList(getElements, types.TOOL, [
      panels.filter(p => !p.hidden).length > 1
        ? ({
            render: () => (
              <Fragment>
                <TabBar key="tabs">
                  {panels
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
            ),
          } as Partial<Addon>)
        : null,
      {
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
      },
    ]);
    const extraTools = getElementList(getElements, types.TOOLEXTRA, [
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <DesktopOnly>
            <IconButton
              key="full"
              onClick={api.toggleFullscreen as any}
              title={options.isFullscreen ? 'Exit full screen' : 'Go full screen'}
            >
              <Icons icon={options.isFullscreen ? 'close' : 'expand'} />
            </IconButton>
          </DesktopOnly>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="opener"
            href={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
            target="_blank"
            title="Open canvas in new tab"
          >
            <Icons icon="share" />
          </IconButton>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="copy"
            onClick={() =>
              copy(
                `${window.location.origin}${
                  window.location.pathname
                }${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`
              )
            }
            title="Copy canvas link"
          >
            <Icons icon="copy" />
          </IconButton>
        ),
      },
    ]);
    // if its a docsOnly page, even the 'story' view mode is considered 'docs'
    const filter = (item: Partial<Addon>) =>
      item &&
      (!item.match ||
        item.match({
          storyId,
          viewMode: docsOnly && viewMode === 'story' ? 'docs' : viewMode,
          location,
          path,
        }));
    const displayItems = (list: Partial<Addon>[]) =>
      list.reduce(
        (acc, item, index) =>
          item ? (
            // @ts-ignore
            <Fragment key={item.id || item.key || `f-${index}`}>
              {acc}
              {item.render({}) || item}
            </Fragment>
          ) : (
            acc
          ),
        null
      );
    const left = displayItems(tools.filter(filter));
    const right = displayItems(extraTools.filter(filter));
    return { left, right };
  }
);
