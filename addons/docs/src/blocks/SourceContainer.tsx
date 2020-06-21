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
  const handleAddJSX = (id: StoryId, newJsx: SourceItem) => {
    if (newJsx !== sources[id]) {
      const newSources = { ...sources, [id]: newJsx };
      setStorySources(newSources);
    }
  };
  const channel = addons.getChannel();
  channel.on(ADD_JSX, handleAddJSX);
  useEffect(() => () => channel.off(ADD_JSX, handleAddJSX), []);

  return <SourceContext.Provider value={{ sources }}>{children}</SourceContext.Provider>;
};
