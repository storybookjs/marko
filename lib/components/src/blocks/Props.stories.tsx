import React from 'react';
import { Props, PropsError } from './Props';
import { normal as normalTable } from '../PropsTable/PropsTable.stories';

export const componentMeta = {
  title: 'Docs|Props',
  Component: Props,
};

export const error = () => <Props error={PropsError.NO_COMPONENT} />;

export const normal = () => <Props rows={normalTable().props.rows} />;
