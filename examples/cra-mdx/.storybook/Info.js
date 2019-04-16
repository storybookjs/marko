import React from 'react';
import PropTypes from 'prop-types';
import { PropTable } from '@storybook/components';
import { Global, createGlobal, ThemeProvider, ensure as ensureTheme } from '@storybook/theming';

export const Info = ({ context }) => {
  const {
    parameters: { component, options },
  } = context;

  const themeVars = options && options.theme;
  const propDefinitions = component && component.propDefinitions;
  const theme = ensureTheme(themeVars);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={createGlobal} />
      {propDefinitions ? <PropTable propDefinitions={propDefinitions} /> : <div>No info</div>}
    </ThemeProvider>
  );
};

Info.propTypes = {
  context: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
