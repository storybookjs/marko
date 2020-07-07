import { getEventMetadata } from '../lib/events';
import { API } from '../index';

describe('getEventMetadata', () => {
  const fullAPI = ({ findRef: jest.fn() } as unknown) as API;

  it('returns local if the event source is for localhost', () => {
    expect(
      getEventMetadata({ type: 'event', source: 'http://localhost:6006' }, fullAPI)
    ).toMatchObject({
      sourceType: 'local',
    });
  });
});
