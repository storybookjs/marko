import { StoriesHash } from '@storybook/api';
import { ControllerStateAndHelpers } from 'downshift';
import { RefType } from './RefHelpers';

export type Item = StoriesHash[keyof StoriesHash];

export type ItemWithRefIdAndPath = Item & { refId: string; path: string[] };

export interface CombinedDataset {
  hash: Record<string, RefType>;
  entries: [string, RefType][];
}

export interface Selection {
  storyId: string;
  refId: string;
}

export interface Match {
  value: string;
  indices: [number, number][];
  key: 'name' | 'path';
  arrayIndex: number;
}

export function isSearchResult(x: any): x is RawSearchresults[0] {
  return !!x.item;
}
export function isExpandType(x: any): x is ExpandType {
  return !!x.totalCount;
}

export interface ExpandType {
  showAll: () => void;
  totalCount: number;
}

export type DownshiftItem = RawSearchresults[0] | ExpandType;

export type RawSearchresults = (Fuse.FuseResultWithMatches<ItemWithRefIdAndPath> &
  Fuse.FuseResultWithScore<ItemWithRefIdAndPath>)[];

export type SearchChildrenFn = (args: {
  inputValue: string;
  results: DownshiftItem[];
  inputHasFocus: boolean;
  getMenuProps: ControllerStateAndHelpers<DownshiftItem>['getMenuProps'];
  getItemProps: ControllerStateAndHelpers<DownshiftItem>['getItemProps'];
  highlightedIndex: number | null;
}) => React.ReactNode;
