import React, { FC, Context, createContext, useEffect, useState } from 'react';
import { addons } from '@storybook/addons';
import { StoryId } from '@storybook/api';
import { SNIPPET_RENDERED } from '../shared';

export type SourceItem = string;
export type StorySources = Record<StoryId, SourceItem>;

export interface SourceContextProps {
  sources?: StorySources;
  setSource?: (id: StoryId, item: SourceItem) => void;
}

export const SourceContext: Context<SourceContextProps> = createContext({});

export const SourceContainer: FC<{}> = ({ children }) => {
  const [sources, setSources] = useState<StorySources>({});
  const channel = addons.getChannel();

  const sourcesRef = React.useRef<StorySources>();
  const handleAddJSX = (id: StoryId, newJsx: SourceItem) => {
    if (newJsx !== sources[id]) {
      const newSources = { ...sourcesRef.current, [id]: newJsx };
      sourcesRef.current = newSources;
    }
  };

  // Bind this early (instead of inside `useEffect`), because the `SNIPPET_RENDERED` event
  // is triggered *during* the rendering process, not after. We have to use the ref
  // to ensure we don't end up calling setState outside the effect though.
  channel.on(SNIPPET_RENDERED, handleAddJSX);

  useEffect(() => {
    if (sourcesRef.current) {
      setSources(sourcesRef.current);
    }

    return () => channel.off(SNIPPET_RENDERED, handleAddJSX);
  }, [sources, setSources]);

  return <SourceContext.Provider value={{ sources }}>{children}</SourceContext.Provider>;
};
