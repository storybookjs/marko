import React from 'react';
import { TabbedArgsTable } from './TabbedArgsTable';
import { Normal, Compact, Sections } from './ArgsTable.stories';

export default {
  component: TabbedArgsTable,
  title: 'Docs/TabbedArgsTable',
};

const propsSection = { category: 'props ' };
const eventsSection = { category: 'events ' };

export const Tabs = (args) => <TabbedArgsTable {...args} />;
Tabs.args = {
  tabs: {
    Normal: Normal.args,
    Compact: Compact.args,
    Sections: Sections.args,
  },
};

export const Empty = Tabs.bind();
Empty.args = {
  tabs: {},
};
