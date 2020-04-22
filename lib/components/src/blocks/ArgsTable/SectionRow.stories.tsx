import React from 'react';
import { SectionRow } from './SectionRow';
import { TableWrapper } from './ArgsTable';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export default {
  component: SectionRow,
  title: 'Docs/ArgsSectionRow',
  decorators: [
    (getStory) => (
      <ResetWrapper>
        <TableWrapper>
          <tbody>{getStory()}</tbody>
        </TableWrapper>
      </ResetWrapper>
    ),
  ],
};

export const props = () => <SectionRow section="Args" />;
