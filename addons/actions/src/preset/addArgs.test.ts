import { StoryContext } from '@storybook/addons';
import { inferActionsFromArgTypesRegex, addActionsFromArgTypes } from './addArgs';

describe('actions parameter enhancers', () => {
  describe('actions.argTypesRegex parameter', () => {
    const baseParameters = {
      argTypes: { onClick: {}, onFocus: {}, somethingElse: {} },
      actions: { argTypesRegex: '^on.*' },
    };

    it('should add actions that match a pattern', () => {
      const parameters = baseParameters;
      const { args } = inferActionsFromArgTypesRegex({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onFocus']);
    });

    it('should prioritize pre-existing args', () => {
      const parameters = {
        ...baseParameters,
        args: { onClick: 'pre-existing arg' },
      };
      const { args } = inferActionsFromArgTypesRegex({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onFocus']);
      expect(args.onClick).toEqual('pre-existing arg');
    });

    it('should do nothing if actions are disabled', () => {
      const parameters = {
        ...baseParameters,
        actions: { ...baseParameters.actions, disable: true },
      };
      const result = inferActionsFromArgTypesRegex({ parameters } as StoryContext);
      expect(result).toBeFalsy();
    });
  });

  describe('argTypes.action parameter', () => {
    const baseParameters = {
      argTypes: {
        onClick: { action: 'clicked!' },
        onBlur: { action: 'blurred!' },
      },
    };

    it('should add actions based on action.args', () => {
      const parameters = baseParameters;
      const { args } = addActionsFromArgTypes({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onBlur']);
    });

    it('should prioritize pre-existing args', () => {
      const parameters = {
        ...baseParameters,
        args: { onClick: 'pre-existing arg' },
      };
      const { args } = addActionsFromArgTypes({ parameters } as StoryContext);
      expect(Object.keys(args)).toEqual(['onClick', 'onBlur']);
      expect(args.onClick).toEqual('pre-existing arg');
    });

    it('should do nothing if actions are disabled', () => {
      const parameters = { ...baseParameters, actions: { disable: true } };
      const result = addActionsFromArgTypes({ parameters } as StoryContext);
      expect(result).toBeFalsy();
    });
  });
});
