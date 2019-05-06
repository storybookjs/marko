import React from 'react';
import { styled } from '@storybook/theming';
import { PropsTable } from '@storybook/components';
import { DocsContext } from './DocsContext';

interface NoPropsProps {
  message: string;
  details: string;
  link: string;
}

interface PropsProps {
  exclude?: string[];
  of?: any;
}

export const NoProps: React.FunctionComponent<NoPropsProps> = ({ message, details, link }) => (
  <>
    <h1>{message}</h1>
    <h1>{details}</h1>
    <a href={link}>more info</a>
  </>
);

class PropsError extends Error {
  details: string = null;

  link: string = null;

  constructor(message: string, details: string, link: string) {
    super(message);
    this.details = details;
    this.link = link;
  }
}

export const Props: React.FunctionComponent<PropsProps> = ({ exclude, of }) => (
  <DocsContext.Consumer>
    {({ parameters, getPropDefs }) => {
      const { component } = parameters;
      try {
        const target = of || component;
        if (!target) {
          throw new PropsError('No component', 'Props needs a component', 'http://fixme');
        }
        if (!getPropDefs) {
          throw new PropsError(
            'Props unsupported',
            'Unable to extract props for your framework',
            'http://fixme'
          );
        }
        const allRows = getPropDefs(target);
        const rows = !exclude ? allRows : allRows.filter(row => !exclude.includes(row.name));
        return <PropsTable rows={rows} />;
      } catch (err) {
        return <NoProps message={err.message} details={err.details} link={err.link} />;
      }
    }}
  </DocsContext.Consumer>
);
