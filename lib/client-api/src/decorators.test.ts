import { StoryContext } from '@storybook/addons';

import { defaultDecorateStory } from './decorators';

function makeContext(input: Record<string, any> = {}): StoryContext {
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
    decorated(makeContext());
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

  it('does not recreate decorated story functions each time', () => {
    const decoratedStories = [];
    const decorators = [
      (s, c) => {
        decoratedStories.push = s;
        return s();
      },
    ];
    const decorated = defaultDecorateStory(() => 0, decorators);

    decorated(makeContext());
    decorated(makeContext());
    expect(decoratedStories[0]).toBe(decoratedStories[1]);
  });

  // NOTE: important point--this test would not work if we called `decoratedOne` twice simultaneously
  // both story functions would receive {story: 2}. The assumption here is that we'll never render
  // the same story twice at the same time.
  it('does not interleave contexts if two decorated stories are call simultaneously', async () => {
    const contexts = [];
    let resolve;
    const fence = new Promise((r) => {
      resolve = r;
    });
    const decorators = [
      async (s, c) => {
        // The fence here simulates async-ness in react rendering an element (`<S />` doesn't run `S()` straight away)
        await fence;
        s();
      },
    ];
    const decoratedOne = defaultDecorateStory((c) => contexts.push(c), decorators);
    const decoratedTwo = defaultDecorateStory((c) => contexts.push(c), decorators);

    decoratedOne(makeContext({ value: 1 }));
    decoratedTwo(makeContext({ value: 2 }));

    resolve();
    await fence;

    expect(contexts[0].value).toBe(1);
    expect(contexts[1].value).toBe(2);
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

  it('DOES NOT merge core metadata or pass through core metadata keys in context', () => {
    const contexts = [];
    const decorators = [
      (s, c) =>
        contexts.push(c) &&
        s({ parameters: { c: 'd' }, id: 'notId', kind: 'notKind', name: 'notName' }),
    ];
    const decorated = defaultDecorateStory((c) => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated(makeContext({ parameters: { a: 'b' } }));
    expect(contexts).toEqual([
      expect.objectContaining({ parameters: { a: 'b' }, id: 'id', kind: 'kind', name: 'name' }),
      expect.objectContaining({ parameters: { a: 'b' }, id: 'id', kind: 'kind', name: 'name' }),
    ]);
  });
});
