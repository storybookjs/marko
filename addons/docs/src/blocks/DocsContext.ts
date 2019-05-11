import React from 'react';
import { PropDef } from '@storybook/components';

export interface DocsContextProps {
  id?: string;
  selectedKind?: string;
  selectedStory?: string;
  mdxKind?: string;
  parameters?: any;
  storyStore?: any;
  forceRender?: () => void;
  getPropDefs?: (component: any) => PropDef[];
}

export const DocsContext: React.Context<DocsContextProps> = React.createContext({});
