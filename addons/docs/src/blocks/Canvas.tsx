import React, { FC, ReactElement, ReactNode, ReactNodeArray, useContext } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { toId, storyNameFromExport } from '@storybook/csf';
import { resetComponents } from '@storybook/components/html';
import { Preview as PurePreview, PreviewProps as PurePreviewProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { SourceContext, SourceContextProps } from './SourceContainer';
import { getSourceProps } from './Source';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

type CanvasProps = PurePreviewProps & {
  withSource?: SourceState;
  mdxSource?: string;
};

const getPreviewProps = (
  {
    withSource = SourceState.CLOSED,
    mdxSource,
    children,
    ...props
  }: CanvasProps & { children?: ReactNode },
  docsContext: DocsContextProps,
  sourceContext: SourceContextProps
): PurePreviewProps => {
  if (withSource === SourceState.NONE) {
    return props;
  }
  if (mdxSource) {
    return {
      ...props,
      withSource: getSourceProps({ code: decodeURI(mdxSource) }, docsContext, sourceContext),
    };
  }
  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  const stories = childArray.filter(
    (c: ReactElement) => c.props && (c.props.id || c.props.name)
  ) as ReactElement[];
  const { mdxComponentMeta, mdxStoryNameToKey } = docsContext;
  const targetIds = stories.map(
    (s) =>
      s.props.id ||
      toId(
        mdxComponentMeta.id || mdxComponentMeta.title,
        storyNameFromExport(mdxStoryNameToKey[s.props.name])
      )
  );
  const sourceProps = getSourceProps({ ids: targetIds }, docsContext, sourceContext);
  return {
    ...props, // pass through columns etc.
    withSource: sourceProps,
    isExpanded: withSource === SourceState.OPEN,
  };
};

export const Canvas: FC<CanvasProps> = (props) => {
  const docsContext = useContext(DocsContext);
  const sourceContext = useContext(SourceContext);
  const previewProps = getPreviewProps(props, docsContext, sourceContext);
  const { children } = props;
  return (
    <MDXProvider components={resetComponents}>
      <PurePreview {...previewProps}>{children}</PurePreview>
    </MDXProvider>
  );
};
