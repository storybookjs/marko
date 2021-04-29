import ArgsTableView from './views/ArgsTableView.svelte';
// eslint-disable-next-line
import srcArgsTableView from '!!raw-loader!./views/ArgsTableView.svelte';

export default {
  title: 'Args Table',
  component: ArgsTableView,
};

export const ArgsTable = (args) => ({
  Component: ArgsTableView,
  props: args,
});
ArgsTable.parameters = {
  docs: {
    source: {
      code: srcArgsTableView,
    },
  },
};
