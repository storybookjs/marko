import { StoryContext } from '@storybook/addons';
import { inferActionsFromArgTypes, addActionsFromArgs } from './addArgs';

describe('actions parameter enhancers', () => {
  describe('argTypes option', () => {
    const baseParameters = {
      argTypes: { onClick: {}, onFocus: {}, somethingElse: {} },
      actions: { argTypesRegex: '^on.*' },
    };

    it('should add actions that match a pattern', () => {
      const parameters = baseParameters;
      const { args } = inferActionsFromArgTypes({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onFocus']);
    });

    it('should prioritize pre-existing args', () => {
      const parameters = {
        ...baseParameters,
        args: { onClick: 'pre-existing arg' },
      };
      const { args } = inferActionsFromArgTypes({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onFocus']);
      expect(args.onClick).toEqual('pre-existing arg');
    });

    it('should do nothing if actions are disabled', () => {
      const parameters = {
        ...baseParameters,
        actions: { ...baseParameters.actions, disable: true },
      };
      const result = inferActionsFromArgTypes({ parameters } as StoryContext);
      expect(result).toBeFalsy();
    });
  });

  describe('args option', () => {
    const baseParameters = {
      actions: { args: ['onClick', 'onBlur'] },
    };

    it('should add actions based on action.args', () => {
      const parameters = baseParameters;
      const { args } = addActionsFromArgs({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onBlur']);
    });

    it('should prioritize pre-existing args', () => {
      const parameters = {
        ...baseParameters,
        args: { onClick: 'pre-existing arg' },
      };
      const { args } = addActionsFromArgs({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onBlur']);
      expect(args.onClick).toEqual('pre-existing arg');
    });

    it('should do nothing if actions are disabled', () => {
      const parameters = { actions: { ...baseParameters.actions, disable: true } };
      const result = addActionsFromArgs({ parameters } as StoryContext);
      expect(result).toBeFalsy();
    });
  });
});
