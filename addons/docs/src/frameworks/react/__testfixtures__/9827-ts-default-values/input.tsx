import React from 'react';

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
  reference: any;
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
  // eslint-disable-next-line no-undef
  reference: window,
};

export const component = Hello;
