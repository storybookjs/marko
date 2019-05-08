import React from 'react';
import { PropsTable, PropDef } from '../PropsTable/PropsTable';

export enum PropsError {
  NO_COMPONENT = 'no component',
  PROPS_UNSUPPORTED = 'props unsupported',
}

export interface PropsProps {
  rows?: PropDef[];
  error?: PropsError;
}

const Props: React.FunctionComponent<PropsProps> = ({ rows, error = null }) => {
  if (error) {
    return <div>{error}</div>;
  }
  return <PropsTable rows={rows} />;
};

export { Props };
