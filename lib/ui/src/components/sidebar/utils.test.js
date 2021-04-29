import { mockDataset, mockExpanded, mockSelected } from './mockdata';

import * as utils from './utils';

const noRoot = {
  dataset: mockDataset.noRoot,
  selected: mockSelected.noRoot,
  expanded: mockExpanded.noRoot,
};

describe('sanity', () => {
  test('all exports should be functions', () => {
    Object.values(utils).forEach((i) => {
      expect(typeof i).toBe('function');
    });
  });
});

describe('createId', () => {
  test('creates an id', () => {
    const inputs = ['testpath', 'testref'];
    const output = utils.createId(...inputs);

    expect(output).toEqual('testref_testpath');
  });
});

describe('get', () => {
  test('retrieved by key', () => {
    const value = {};
    const inputs = ['testkey', { testkey: value, x: 'incorrect' }];
    const output = utils.get(inputs[0], inputs[1]);

    expect(output).toBe(value);
  });
  test('retrieve non-existent returns undefined', () => {
    const value = {};
    const inputs = ['NONEXISTENT', { testkey: value, x: 'incorrect' }];
    const output = utils.get(inputs[0], inputs[1]);

    expect(output).toBe(undefined);
  });
});

describe('getParent', () => {
  test('retrieved by id (level 0) returns undefined', () => {
    const output = utils.getParent('1', noRoot.dataset);
    expect(output).toBe(undefined);
  });
  test('retrieved by id (level 1) returns correctly', () => {
    const output = utils.getParent('1-12', noRoot.dataset);
    expect(output).toBe(noRoot.dataset['1']);
  });
  test('retrieved by id (level 2) returns correctly', () => {
    const output = utils.getParent('1-12-121', noRoot.dataset);
    expect(output).toBe(noRoot.dataset['1-12']);
  });
  test('retrieve non-existent returns undefined', () => {
    const output = utils.getParent('NONEXISTENT', noRoot.dataset);
    expect(output).toBe(undefined);
  });
});

describe('getParents', () => {
  test('retrieved by id (level 0) returns correctly', () => {
    const output = utils.getParents('1', noRoot.dataset);
    expect(output).toEqual([]);
  });
  test('retrieved by id (level 1) returns correctly', () => {
    const output = utils.getParents('1-12', noRoot.dataset);
    expect(output).toEqual([noRoot.dataset['1']]);
  });
  test('retrieved by id (level 2) returns correctly', () => {
    const output = utils.getParents('1-12-121', noRoot.dataset);
    expect(output).toEqual([noRoot.dataset['1-12'], noRoot.dataset['1']]);
  });
  test('retrieve non-existent returns empty array', () => {
    const output = utils.getParents('NONEXISTENT', noRoot.dataset);
    expect(output).toEqual([]);
  });
});
