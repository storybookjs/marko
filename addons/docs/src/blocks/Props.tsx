import React from 'react';
import { Props, PropsError, PropsProps as PurePropsProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';

interface PropsProps {
  exclude?: string[];
  of?: any;
}

export const getPropsProps = (
  { exclude, of }: PropsProps,
  { parameters, getPropDefs }: DocsContextProps
): PurePropsProps => {
  const { component } = parameters;
  try {
    const target = of || component;
    if (!target) {
      throw new Error(PropsError.NO_COMPONENT);
    }
    if (!getPropDefs) {
      throw new Error(PropsError.PROPS_UNSUPPORTED);
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
      const propsProps = getPropsProps(props, context);
      return <Props {...propsProps} />;
    }}
  </DocsContext.Consumer>
);

export { PropsContainer as Props };
