import { useStorybookApi } from '@storybook/api';
import React, { FunctionComponent } from 'react';

import ReleaseNotesScreen from './release_notes';

const ReleaseNotesPage: FunctionComponent = () => {
  const api = useStorybookApi();
  return <ReleaseNotesScreen version={api.releaseNotesVersion()} />;
};

export { ReleaseNotesPage as default };
