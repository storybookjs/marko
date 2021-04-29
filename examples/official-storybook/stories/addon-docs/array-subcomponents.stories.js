import React from 'react';
import Button from '../../components/TsButton';

export default {
  title: 'Addons/Docs/Subcomponents array',
  component: Button,
  subcomponents: [Button],
};

export const Basic = () => <Button>Bad subcomponents</Button>;
