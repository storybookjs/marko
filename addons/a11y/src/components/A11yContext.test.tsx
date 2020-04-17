import React from 'react';
import { render, act } from '@testing-library/react';
import * as api from '@storybook/api';
import { STORY_CHANGED } from '@storybook/core-events';

import { A11yContextProvider } from './A11yContext';
import { EVENTS } from '../constants';

jest.mock('@storybook/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('A11YPanel', () => {
  beforeEach(() => {
    mockedApi.useChannel.mockReset();

    mockedApi.useChannel.mockReturnValue(jest.fn());
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <A11yContextProvider active>
        <div data-testid="child" />
      </A11yContextProvider>
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  it('should not render when inactive', () => {
    const { queryByTestId } = render(
      <A11yContextProvider active={false}>
        <div data-testid="child" />
      </A11yContextProvider>
    );
    expect(queryByTestId('child')).toBeFalsy();
  });

  it('should emit highlight with no values when inactive', () => {
    const emit = jest.fn();
    mockedApi.useChannel.mockReturnValue(emit);
    const { rerender } = render(
      <A11yContextProvider active>
        <div data-testid="child" />
      </A11yContextProvider>
    );
    rerender(
      <A11yContextProvider active={false}>
        <div data-testid="child" />
      </A11yContextProvider>
    );
    expect(emit).toHaveBeenLastCalledWith(
      EVENTS.HIGHLIGHT,
      expect.objectContaining({
        color: expect.any(String),
        elements: [],
      })
    );
  });

  it('should emit highlight with no values when story changed', () => {
    const emit = jest.fn();
    mockedApi.useChannel.mockReturnValue(emit);
    render(<A11yContextProvider active />);
    const useChannelArgs = mockedApi.useChannel.mock.calls[0][0];
    act(() => useChannelArgs[STORY_CHANGED]());
    expect(emit).toHaveBeenLastCalledWith(
      EVENTS.HIGHLIGHT,
      expect.objectContaining({
        color: expect.any(String),
        elements: [],
      })
    );
  });
});
