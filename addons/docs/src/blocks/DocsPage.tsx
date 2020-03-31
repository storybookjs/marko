import React, { FunctionComponent } from 'react';
import { DocsPageProps } from './types';
import { Title } from './Title';
import { Subtitle } from './Subtitle';
import { Description } from './Description';
import { Primary } from './Primary';
import { Props } from './Props';
import { Stories } from './Stories';

export const DocsPage: FunctionComponent<DocsPageProps> = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <Primary />
    <Props />
    <Stories />
  </>
);
