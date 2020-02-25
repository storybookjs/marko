import React, { FunctionComponent, Fragment } from 'react';
import { ListItem } from './Tree/ListItem';

export const Loader: FunctionComponent<{
  size: 'single' | 'multiple';
}> = ({ size }) => {
  return size === 'multiple' ? (
    <Fragment>
      <ListItem isLoading />
      <ListItem isLoading />
      <ListItem depth={1} isLoading />
      <ListItem depth={1} isLoading />
      <ListItem depth={2} isLoading />
      <ListItem depth={3} isLoading />
      <ListItem depth={3} isLoading />
      <ListItem depth={3} isLoading />
      <ListItem depth={1} isLoading />
      <ListItem depth={1} isLoading />
      <ListItem depth={1} isLoading />
      <ListItem depth={2} isLoading />
      <ListItem depth={2} isLoading />
      <ListItem depth={2} isLoading />
      <ListItem depth={3} isLoading />
      <ListItem isLoading />
      <ListItem isLoading />
    </Fragment>
  ) : (
    <ListItem isLoading />
  );
};
