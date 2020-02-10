import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';
import { styled } from '@storybook/theming';
import { API } from '@storybook/api';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import addons, { types, Types, Addon } from '@storybook/addons';
import merge from '@storybook/api/dist/lib/merge';
import { Loader } from '@storybook/components';

import { Helmet } from 'react-helmet-async';

import { Toolbar } from './toolbar';

import * as S from './components';

import { ZoomProvider, ZoomConsumer } from './zoom';

import { IFrame } from './iframe';
import { PreviewProps, ApplyWrappersProps, IframeRenderer } from './PreviewProps';
import { getTools } from './getTools';
import { defaultWrappers, ApplyWrappers } from './ApplyWrappers';

export const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});

export const stringifyQueryParams = (queryParams: Record<string, string>) =>
  Object.entries(queryParams).reduce((acc, [k, v]) => {
    return `${acc}&${k}=${v}`;
  }, '');

export const renderIframe: IframeRenderer = (
  storyId,
  viewMode,
  id,
  baseUrl,
  scale,
  queryParams
) => (
  <IFrame
    key="iframe"
    id="storybook-preview-iframe"
    title={id || 'preview'}
    src={`${baseUrl}?id=${storyId}&viewMode=${viewMode}${stringifyQueryParams(queryParams)}`}
    allowFullScreen
    scale={scale}
  />
);

export const getElementList = memoize(
  10
)((getFn: API['getElements'], type: Types, base: Partial<Addon>[]) =>
  base.concat(Object.values(getFn(type)))
);

const getDocumentTitle = (description: string) => {
  return description ? `${description} ⋅ Storybook` : 'Storybook';
};

class Preview extends Component<PreviewProps> {
  shouldComponentUpdate({
    storyId,
    viewMode,
    docsOnly,
    options,
    queryParams,
    parameters,
  }: PreviewProps) {
    const { props } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      docsOnly !== props.docsOnly ||
      storyId !== props.storyId ||
      queryParams !== props.queryParams ||
      parameters !== props.parameters
    );
  }

  componentDidUpdate(prevProps: PreviewProps) {
    const { api, storyId, viewMode } = this.props;
    const { storyId: prevStoryId, viewMode: prevViewMode } = prevProps;
    if ((storyId && storyId !== prevStoryId) || (viewMode && viewMode !== prevViewMode)) {
      api.emit(SET_CURRENT_STORY, { storyId, viewMode });
    }
  }

  render() {
    const {
      id,
      location,
      queryParams,
      getElements,
      api,
      options,
      viewMode = undefined,
      docsOnly = false,
      storyId = undefined,
      path = undefined,
      description = undefined,
      baseUrl = 'iframe.html',
      customCanvas = undefined,
      parameters = undefined,
      isLoading = true,
      withLoader = true,
    } = this.props;
    const toolbarHeight = options.isToolshown ? 40 : 0;
    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    let panels = getElementList(getElements, types.TAB, [
      {
        route: p => `/story/${p.storyId}`,
        match: p => !!(p.viewMode && p.viewMode.match(/^(story|docs)$/)),
        render: p => (
          <ZoomConsumer>
            {({ value: scale }) => {
              const props = {
                viewMode,
                active: p.active,
                wrappers,
                id,
                storyId,
                baseUrl,
                queryParams,
                scale,
                customCanvas,
              } as ApplyWrappersProps;

              const data = [storyId, viewMode, id, baseUrl, scale, queryParams] as Parameters<
                IframeRenderer
              >;

              const content = customCanvas ? customCanvas(...data) : renderIframe(...data);

              return (
                <>
                  {withLoader && isLoading && <Loader id="preview-loader" role="progressbar" />}
                  <ApplyWrappers {...props}>{content}</ApplyWrappers>
                </>
              );
            }}
          </ZoomConsumer>
        ),
        title: 'Canvas',
        id: 'canvas',
      },
    ]);
    const { previewTabs } = addons.getConfig();
    const parametersTabs = parameters ? parameters.previewTabs : undefined;
    if (previewTabs || parametersTabs) {
      // deep merge global and local settings
      const tabs = merge(previewTabs, parametersTabs);
      const arrTabs = Object.keys(tabs).map((key, index) => ({
        index,
        ...(typeof tabs[key] === 'string' ? { title: tabs[key] } : tabs[key]),
        id: key,
      }));
      panels = panels
        .filter(panel => {
          const t = arrTabs.find(tab => tab.id === panel.id);
          return t === undefined || t.id === 'canvas' || !t.hidden;
        })
        .map((panel, index) => ({ ...panel, index }))
        .sort((p1, p2) => {
          const tab_1 = arrTabs.find(tab => tab.id === p1.id);
          const index_1 = tab_1 ? tab_1.index : arrTabs.length + p1.index;
          const tab_2 = arrTabs.find(tab => tab.id === p2.id);
          const index_2 = tab_2 ? tab_2.index : arrTabs.length + p2.index;
          return index_1 - index_2;
        })
        .map(panel => {
          const t = arrTabs.find(tab => tab.id === panel.id);
          if (t) {
            return {
              ...panel,
              title: t.title || panel.title,
              disabled: t.disabled,
              hidden: t.hidden,
            };
          }
          return panel;
        });
    }
    const { left, right } = getTools(
      getElements,
      queryParams,
      panels,
      api,
      options,
      storyId,
      viewMode,
      docsOnly,
      location,
      path,
      baseUrl
    );

    return (
      <ZoomProvider>
        <Fragment>
          {id === 'main' && (
            <Helmet key="description">
              <title>{getDocumentTitle(description)}</title>
            </Helmet>
          )}
          {(left || right) && (
            <Toolbar key="toolbar" shown={options.isToolshown} border>
              <Fragment key="left">{left}</Fragment>
              <Fragment key="right">{right}</Fragment>
            </Toolbar>
          )}
          <S.FrameWrap key="frame" offset={toolbarHeight}>
            {panels.map(p => (
              // @ts-ignore
              <Fragment key={p.id || p.key}>
                {p.render({ active: p.match({ storyId, viewMode, location, path }) })}
              </Fragment>
            ))}
          </S.FrameWrap>
        </Fragment>
      </ZoomProvider>
    );
  }
}

export { Preview };
