import React, { FunctionComponent } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

import { Consumer, Combo } from '@storybook/api';

import { PARAM_KEY } from '.';
import { reIndentQuery, getDefaultFetcher } from './shared';

interface GQLProps {
  active: boolean;
}

const GQL: FunctionComponent<GQLProps> = ({ active }) => {
  return active ? (
    <Consumer>
      {({ api, state }: Combo) => {
        const story = api.getData(state.storyId, state.refId);
        const parameters = story
          ? api.getCurrentParameter<{
              query: string;
              variables: Record<string, any>;
              url: string;
              fetcher: ReturnType<typeof getDefaultFetcher>;
            }>(PARAM_KEY)
          : null;

        if (parameters) {
          const query = reIndentQuery(parameters.query);
          const variables = parameters.variables || '{}';
          const url = parameters.url || '';
          const fetcher = parameters.fetcher || getDefaultFetcher(url);

          return <GraphiQL query={query} variables={variables} fetcher={fetcher} />;
        }
        return <div>You have not configured GraphiQL yet</div>;
      }}
    </Consumer>
  ) : null;
};

export default GQL;
