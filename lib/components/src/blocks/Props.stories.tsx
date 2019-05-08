import React from 'react';
import { Props, PropsError } from './Props';
import { normal as normalTable } from '../PropsTable/PropsTable.stories';

export const componentMeta = {
  title: 'Docs|Props',
  Component: Props,
};

const errorProps = { error: PropsError.NO_COMPONENT };
export const error = () => <Props {...errorProps} />;
error.props = errorProps;

export const normal = () => <Props {...normalTable.props} />;
normal.props = normalTable.props;
