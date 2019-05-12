import React from 'react';
import Markdown from 'markdown-to-jsx';

export interface DescriptionProps {
  markdown?: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = ({ markdown }) =>
  markdown ? <Markdown>{markdown}</Markdown> : null;
