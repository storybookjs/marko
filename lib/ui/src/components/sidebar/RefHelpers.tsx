import { StoriesHash, State } from '@storybook/api';

export type Refs = State['refs'];
export type RefType = Refs[keyof Refs];
export type BooleanSet = Record<string, boolean>;
export type Item = StoriesHash[keyof StoriesHash];
export type DataSet = Record<string, Item>;
export type FilteredType = 'filtered' | 'unfiltered';

export const getType = (isLoading: boolean, isAuthRequired: boolean, isError: boolean) => {
  if (isAuthRequired) {
    return 'auth';
  }
  if (isError) {
    return 'error';
  }
  if (isLoading) {
    return 'loading';
  }
  return 'ready';
};
