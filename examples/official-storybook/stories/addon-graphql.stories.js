import React from 'react';

export default {
  title: 'Addons/GraphQL',
  parameters: {
    previewTabs: {
      graphiql: { hidden: false, title: 'GraphiQL' },
    },
  },
};

export const GetPikachu = () => <div>hello</div>;

GetPikachu.storyName = 'get Pikachu';

GetPikachu.parameters = {
  graphiql: {
    query: `{
        pokemon(name: "Pikachu") {
          id
          number
          name
          attacks {
            special {
              name
              type
              damage
            }
          }
          evolutions {
            id
            number
            name
            weight {
              minimum
              maximum
            }
            attacks {
              fast {
                name
                type
                damage
              }
            }
          }
        }
      }`,
    url: 'https://graphql-pokemon.now.sh/?',
  },
};
