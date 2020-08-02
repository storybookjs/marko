import React from 'react';

export default {
  title: 'Addons/Options',
};

export const SettingName = () => (
  <div>This story should have changed the name of the storybook</div>
);

SettingName.storyName = 'setting name';

SettingName.parameters = {
  options: {
    name: 'Custom Storybook',
  },
};

export const HidingAddonPanel = () => (
  <div>This story should have changed hidden the addons panel</div>
);

HidingAddonPanel.storyName = 'hiding addon panel';

HidingAddonPanel.parameters = {
  options: {
    showPanel: false,
  },
};
