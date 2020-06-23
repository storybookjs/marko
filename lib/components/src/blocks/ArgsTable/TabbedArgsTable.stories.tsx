import React from 'react';
import { TabbedArgsTable } from './TabbedArgsTable';
import { Normal, Compact, Sections } from './ArgsTable.stories';

export default {
  component: TabbedArgsTable,
  title: 'Docs/TabbedArgsTable',
};

const Story = (args) => <TabbedArgsTable {...args} />;

export const Tabs = Story.bind({});
Tabs.args = {
  tabs: {
    Normal: Normal.args,
    Compact: Compact.args,
    Sections: Sections.args,
  },
};

export const TabsInAddonPanel = Story.bind({});
TabsInAddonPanel.args = {
  tabs: {
    Normal: Normal.args,
    Compact: Compact.args,
    Sections: Sections.args,
  },
  inAddonPanel: true,
};

export const Empty = Story.bind({});
Empty.args = {
  tabs: {},
};
