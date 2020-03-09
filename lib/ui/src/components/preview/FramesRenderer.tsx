import React, { Fragment, FunctionComponent, useMemo, useEffect, useState } from 'react';
import { Global, CSSObject } from '@storybook/theming';
import { useStorybookApi } from '@storybook/api';
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
            visibility: 'hidden',
          },
          [`span + #storybook-ref-${r.id}`]: {
            visibility: 'visible',
          },
        }),
        {} as CSSObject
      ),
      '#storybook-preview-iframe': {
        visibility: 'hidden',
      },
      'span + #storybook-preview-iframe': {
        visibility: 'visible',
      },
    };
  }, [refs]);

  const [frames, setFrames] = useState<Record<string, string>>({
    'storybook-preview-iframe': `iframe.html?id=${storyId}&viewMode=${viewMode}${stringifiedQueryParams}`,
  });
  const { splitStoryId } = useStorybookApi();

  useEffect(() => {
    const newFrames = Object.values(refs)
      .filter(r => {
        if (r.startInjected) {
          return true;
        }
        if (story && r.id === story.refId) {
          return true;
        }

        return false;
      })
      .reduce((acc, r) => {
        const id = storyId === '*' ? storyId : splitStoryId(storyId).id;

        return {
          ...acc,
          [`storybook-ref-${r.id}`]: `${r.url}/iframe.html?id=${id}&viewMode=${viewMode}${stringifiedQueryParams}`,
        };
      }, frames);

    setFrames(newFrames);
  }, [storyId, story, refs]);

  return (
    <Fragment>
      <Global styles={styles} />
      {Object.entries(frames).map(([id, src]) => (
        <Fragment key={id}>
          {id === active ? <span key={`${id}-indicator`} /> : null}
          <IFrame key={id} id={id} title={id} src={src} allowFullScreen scale={scale} />
        </Fragment>
      ))}
    </Fragment>
  );
};
