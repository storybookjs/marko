import React from 'react';

import { imported } from './imported';

const local = 'local-value';

export interface HelloProps {
  numberSet: number;
  numberUnset?: number;
  stringSet: string;
  stringUnset?: string;
  booleanSet: boolean;
  booleanUnset?: boolean;
  arraySet: string[];
  arrayUnset?: string[];
  objectSet: Record<string, string>;
  objectUnset: Record<string, string>;
  functionSet: () => string;
  functionUnset?: () => string;
  dateSet: Date;
  dateUnset?: Date;
  localReference: string;
  importedReference: string;
  globalReference: any;
}

const Hello = (props: HelloProps) => {
  return <div className="hello">Hello Component</div>;
};

Hello.defaultProps = {
  numberSet: 1,
  stringSet: 'stringSet',
  booleanSet: false,
  arraySet: ['array', 'set'],
  objectSet: { object: 'set' },
  functionSet: () => 'foo',
  dateSet: new Date(),
  localReference: local,
  importedReference: imported,
  globalReference: Date,
};

export const component = Hello;
