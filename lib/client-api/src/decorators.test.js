import { defaultDecorateStory } from './decorators';

describe('client-api.decorators', () => {
  it('calls decorators in out to in order', () => {
    const order = [];
    const decorators = [
      s => order.push(1) && s(),
      s => order.push(2) && s(),
      s => order.push(3) && s(),
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
    const decorated = defaultDecorateStory(c => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated({ k: 0 });
    expect(contexts).toEqual([{ k: 0 }, { k: 3 }, { k: 2 }, { k: 1 }]);
  });

  it('merges contexts', () => {
    const contexts = [];
    const decorators = [(s, c) => contexts.push(c) && s({ c: 'd' })];
    const decorated = defaultDecorateStory(c => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated({ a: 'b' });
    expect(contexts).toEqual([{ a: 'b' }, { a: 'b', c: 'd' }]);
  });

  it('DOES NOT merge parameter or pass through parameters key in context', () => {
    const contexts = [];
    const decorators = [(s, c) => contexts.push(c) && s({ parameters: { c: 'd' } })];
    const decorated = defaultDecorateStory(c => contexts.push(c), decorators);

    expect(contexts).toEqual([]);
    decorated({ parameters: { a: 'b' } });
    expect(contexts).toEqual([{ parameters: { a: 'b' } }, { parameters: { a: 'b' } }]);
  });
});
