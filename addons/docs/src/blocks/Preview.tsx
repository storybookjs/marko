import React, {
  createElement,
  ElementType,
  FunctionComponent,
  ReactElement,
  ReactNode,
  ReactNodeArray,
} from 'react';
import { MDXProvider } from '@mdx-js/react';
import { toId, storyNameFromExport } from '@storybook/csf';
import { components as docsComponents } from '@storybook/components/html';
import { Preview as PurePreview, PreviewProps as PurePreviewProps } from '@storybook/components';
import { getSourceProps } from './Source';
import { DocsContext, DocsContextProps } from './DocsContext';

const resetComponents: Record<string, ElementType> = {};
Object.keys(docsComponents).forEach(key => {
  resetComponents[key] = (props: any) => createElement(key, props);
});

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

type PreviewProps = PurePreviewProps & {
  withSource?: SourceState;
  mdxSource?: string;
  resetStyles?: boolean;
};

const getPreviewProps = (
  {
    withSource = SourceState.CLOSED,
    mdxSource,
    children,
    ...props
  }: PreviewProps & { children?: ReactNode },
  { mdxStoryNameToKey, mdxComponentMeta, storyStore }: DocsContextProps
): PurePreviewProps => {
  if (withSource === SourceState.NONE) {
    return props;
  }
  if (mdxSource) {
    return {
      ...props,
      withSource: getSourceProps({ code: decodeURI(mdxSource) }, { storyStore }),
    };
  }
  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  const stories = childArray.filter(
    (c: ReactElement) => c.props && (c.props.id || c.props.name)
  ) as ReactElement[];
  const targetIds = stories.map(
    s =>
      s.props.id ||
      toId(
        mdxComponentMeta.id || mdxComponentMeta.title,
        storyNameFromExport(mdxStoryNameToKey[s.props.name])
      )
  );
  const sourceProps = getSourceProps({ ids: targetIds }, { storyStore });
  return {
    ...props, // pass through columns etc.
    withSource: sourceProps,
    isExpanded: withSource === SourceState.OPEN,
  };
};

export const Preview: FunctionComponent<PreviewProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const previewProps = getPreviewProps(props, context);
      return (
        <MDXProvider components={props.resetStyles ? resetComponents : docsComponents}>
          <PurePreview {...previewProps}>{props.children}</PurePreview>
        </MDXProvider>
      );
    }}
  </DocsContext.Consumer>
);
