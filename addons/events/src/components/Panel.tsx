import React, { useState, FunctionComponent, useCallback } from 'react';

import { styled } from '@storybook/theming';
import { useChannel } from '@storybook/api';

import { EVENTS } from '../constants';
import Event from './Event';
import { Event as EventType, OnEmitEvent } from '../index';

const Wrapper = styled.div({
  width: '100%',
  boxSizing: 'border-box',
  padding: 10,
  minHeight: '100%',
});

interface EventsPanelProps {
  active: boolean;
}

const EventsPanel: FunctionComponent<EventsPanelProps> = ({ active }) => {
  const [state, setState] = useState<EventType[]>([]);

  const emit = useChannel({
    [EVENTS.ADD]: (events: EventType[]) => setState(events),
  });

  const onEmit = useCallback((event: OnEmitEvent) => {
    emit(EVENTS.EMIT, event);
  }, []);

  return active ? (
    <Wrapper>
      {state.map(event => (
        <Event key={event.name} {...event} onEmit={onEmit} />
      ))}
    </Wrapper>
  ) : null;
};

export default EventsPanel;
