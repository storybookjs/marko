import React, { Fragment, FunctionComponent, useMemo, useEffect, useRef } from 'react';
import { Global, CSSObject } from '@storybook/theming';
import { IFrame } from './iframe';
import { FramesRendererProps } from './utils/types';
import { stringifyQueryParams } from './utils/stringifyQueryParams';

export const FramesRenderer: FunctionComponent<FramesRendererProps> = ({
  refs,
  story,
  scale,
  viewMode,
  queryParams,
  storyId,
}) => {
  const stringifiedQueryParams = stringifyQueryParams(queryParams);
  const active = story && story.refId ? `storybook-ref-${story.refId}` : 'storybook-preview-iframe';

  const styles = useMemo<CSSObject>(() => {
    return {
      ...Object.values(refs).reduce(
        (acc, r) => ({
          ...acc,
          [`#storybook-ref-${r.id}`]: {
            visibility: active === `storybook-ref-${r.id}` ? 'visible' : 'hidden',
          },
        }),
        {} as CSSObject
      ),
      '#storybook-preview-iframe': {
        visibility: active === 'storybook-preview-iframe' ? 'visible' : 'hidden',
      },
    };
  }, [storyId, story, refs]);

  const frames = useRef<Record<string, string>>({
    'storybook-preview-iframe': `iframe.html?id=${storyId}&viewMode=${viewMode}${stringifiedQueryParams}`,
  });

  useEffect(() => {
    Object.values(refs)
      .filter(r => r.startInjected || (story && r.id === story.refId))
      .forEach(r => {
        frames.current = {
          ...frames.current,
          [`storybook-ref-${r.id}`]: `${r.url}/iframe.html?id=${storyId}&viewMode=${viewMode}${stringifiedQueryParams}`,
        };
      });
  }, [storyId, story, refs]);

  return (
    <Fragment>
      <Global styles={styles} />
      {Object.entries(frames.current).map(([id, src]) => (
        <IFrame key={id} id={id} title={id} src={src} allowFullScreen scale={scale} />
      ))}
    </Fragment>
  );
};
