import React from 'react';
import { PropsTable, PropsTableError, PropsTableProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { CURRENT_SELECTION } from './shared';

interface PropsProps {
  exclude?: string[];
  of: any;
}

export const getPropsTableProps = (
  { exclude, of }: PropsProps,
  { parameters, getPropDefs }: DocsContextProps
): PropsTableProps => {
  const { component } = parameters;
  try {
    const target = of === CURRENT_SELECTION ? component : of;
    if (!target) {
      throw new Error(PropsTableError.NO_COMPONENT);
    }
    if (!getPropDefs) {
      throw new Error(PropsTableError.PROPS_UNSUPPORTED);
    }
    const allRows = getPropDefs(target);
    const rows = !exclude ? allRows : allRows.filter(row => !exclude.includes(row.name));
    return { rows };
  } catch (err) {
    return { error: err.message };
  }
};

const PropsContainer: React.FunctionComponent<PropsProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const propsTableProps = getPropsTableProps(props, context);
      return <PropsTable {...propsTableProps} />;
    }}
  </DocsContext.Consumer>
);

export { PropsContainer as Props };
