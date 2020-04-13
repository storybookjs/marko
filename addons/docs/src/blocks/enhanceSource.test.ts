import { StoryContext } from '@storybook/addons';
import { enhanceSource } from './enhanceSource';

const emptyContext: StoryContext = {
  id: 'foo--bar',
  kind: 'foo',
  name: 'bar',
  args: {},
  globalArgs: {},
  parameters: {},
};

const formatSource = (src?: string) => (src ? `formatted: ${src}` : 'no src');

describe('addon-docs enhanceSource', () => {
  describe('no source loaded', () => {
    const baseContext = emptyContext;
    it('no formatSource', () => {
      expect(enhanceSource(baseContext)).toBeNull();
    });
    it('formatSource', () => {
      const parameters = { ...baseContext.parameters, docs: { formatSource } };
      expect(enhanceSource({ ...baseContext, parameters })).toBeNull();
    });
  });
  describe('custom/mdx source loaded', () => {
    const baseContext = {
      ...emptyContext,
      parameters: { storySource: { source: 'storySource.source' } },
    };
    it('no formatSource', () => {
      expect(enhanceSource(baseContext)).toEqual({
        docs: { source: { code: 'storySource.source' } },
      });
    });
    it('formatSource', () => {
      const parameters = { ...baseContext.parameters, docs: { formatSource } };
      expect(enhanceSource({ ...baseContext, parameters }).docs.source).toEqual({
        code: 'formatted: storySource.source',
      });
    });
  });
  describe('storysource source loaded w/ locationsMap', () => {
    const baseContext = {
      ...emptyContext,
      parameters: {
        storySource: {
          source: 'storySource.source',
          locationsMap: {
            'foo--bar': { startBody: { line: 1, col: 5 }, endBody: { line: 1, col: 11 } },
          },
        },
      },
    };
    it('no formatSource', () => {
      expect(enhanceSource(baseContext)).toEqual({ docs: { source: { code: 'Source' } } });
    });
    it('formatSource', () => {
      const parameters = { ...baseContext.parameters, docs: { formatSource } };
      expect(enhanceSource({ ...baseContext, parameters }).docs.source).toEqual({
        code: 'formatted: Source',
      });
    });
  });
  describe('custom docs.source provided', () => {
    const baseContext = {
      ...emptyContext,
      parameters: {
        storySource: { source: 'storySource.source' },
        docs: { source: { code: 'docs.source.code' } },
      },
    };
    it('no formatSource', () => {
      expect(enhanceSource(baseContext)).toBeNull();
    });
    it('formatSource', () => {
      const { source } = baseContext.parameters.docs;
      const parameters = { ...baseContext.parameters, docs: { source, formatSource } };
      expect(enhanceSource({ ...baseContext, parameters })).toBeNull();
    });
  });
});
