import { StoriesHash, State } from '@storybook/api';

export type Refs = State['refs'];
export type RefType = Refs[keyof Refs];
export type BooleanSet = Record<string, boolean>;
export type Item = StoriesHash[keyof StoriesHash];
export type DataSet = Record<string, Item>;
export type FilteredType = 'filtered' | 'unfiltered';

export const getStateType = (
  isLoading: boolean,
  isAuthRequired: boolean,
  isError: boolean,
  isEmpty: boolean
) => {
  if (isAuthRequired) {
    return 'auth';
  }
  if (isError) {
    return 'error';
  }
  if (isLoading) {
    return 'loading';
  }
  if (isEmpty) {
    return 'empty';
  }
  return 'ready';
};
