import React, { FC, Context, createContext, useEffect, useState } from 'react';
import { addons } from '@storybook/addons';
import { StoryId } from '@storybook/api';

export type SourceItem = string;
export type StorySources = Record<StoryId, SourceItem>;

export interface SourceContextProps {
  sources?: StorySources;
  setSource?: (id: StoryId, item: SourceItem) => void;
}

export const SourceContext: Context<SourceContextProps> = createContext({});

const ADD_JSX = 'kadira/jsx/add_jsx';

export const SourceContainer: FC<{}> = ({ children }) => {
  const [sources, setStorySources] = useState<StorySources>({});
  const channel = addons.getChannel();

  const sourcesRef = React.useRef<StorySources>();
  const handleAddJSX = (id: StoryId, newJsx: SourceItem) => {
    if (newJsx !== sources[id]) {
      const newSources = { ...sources, [id]: newJsx };
      sourcesRef.current = newSources;
    }
  };

  // Bind this early (instead of inside `useEffect`), because the `ADD_JSX` event
  // is triggered *during* the rendering process, not after. We have to use the ref
  // to ensure we don't end up calling setState outside the effect though.
  channel.on(ADD_JSX, handleAddJSX);

  useEffect(() => {
    if (sourcesRef.current) {
      setStorySources(sourcesRef.current);
    }

    return () => channel.off(ADD_JSX, handleAddJSX);
  }, [sources, setStorySources]);

  return <SourceContext.Provider value={{ sources }}>{children}</SourceContext.Provider>;
};
