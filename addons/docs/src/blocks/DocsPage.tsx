import React, { FC } from 'react';
import { Title } from './Title';
import { Subtitle } from './Subtitle';
import { Description } from './Description';
import { Primary } from './Primary';
import { ArgsTable } from './ArgsTable';
import { Stories } from './Stories';

export const DocsPage: FC = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <Primary />
    <ArgsTable />
    <Stories />
  </>
);
