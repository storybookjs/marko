import { useStorybookApi } from '@storybook/api';
import React, { FunctionComponent, useEffect } from 'react';

import { ReleaseNotesScreen } from './release_notes';

const ReleaseNotesPage: FunctionComponent<{ onClose: () => void }> = ({ onClose }) => {
  const api = useStorybookApi();

  useEffect(() => {
    api.setDidViewReleaseNotes();
  }, []);

  return <ReleaseNotesScreen onClose={onClose} version={api.releaseNotesVersion()} />;
};

export { ReleaseNotesPage };
