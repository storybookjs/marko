import { StoryContext } from '@storybook/addons';

import { defaultDecorateStory } from './decorators';

function makeContext(input: Record<string, any>): StoryContext {
  return {
    id: 'id',
    kind: 'kind',
    name: 'name',
    viewMode: 'story',
    parameters: {},
    ...input,
  } as StoryContext;
}

describe('client-api.decorators', () => {
  it('calls decorators in out to in order', () => {
    const order = [];
    const decorators = [
      (s) => order.push(1) && s(),
      (s) => order.push(2) && s(),
      (s) => order.push(3) && s(),
    ];
    const decorated = defaultDecorateStory(() => order.push(4), decorators);

    expect(order).toEqual([]);
    decorated();
    expect(order).toEqual([3, 2, 1, 4]);
  });

  it('passes context through to sub decorators', () => {
    const contexts = [];
    const decorators = [
      (s, c) => contexts.push(c) && s({ k: 1 }),
      (s, c) => contexts.push(c) && s({ k: 2 }),
      (s, c) => contexts.push(c) && s({ k: 3 }),
    ];
    const decorated = defaultDecorateStory((c) => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated(makeContext({ k: 0 }));
    expect(contexts.map((c) => c.k)).toEqual([0, 3, 2, 1]);
  });

  it('merges contexts', () => {
    const contexts = [];
    const decorators = [(s, c) => contexts.push(c) && s({ c: 'd' })];
    const decorated = defaultDecorateStory((c) => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated(makeContext({ a: 'b' }));
    expect(contexts).toEqual([
      expect.objectContaining({ a: 'b' }),
      expect.objectContaining({ a: 'b', c: 'd' }),
    ]);
  });

  it('DOES NOT merge parameter or pass through parameters key in context', () => {
    const contexts = [];
    const decorators = [(s, c) => contexts.push(c) && s({ parameters: { c: 'd' } })];
    const decorated = defaultDecorateStory((c) => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated(makeContext({ parameters: { a: 'b' } }));
    expect(contexts).toEqual([
      expect.objectContaining({ parameters: { a: 'b' } }),
      expect.objectContaining({ parameters: { a: 'b' } }),
    ]);
  });
});
