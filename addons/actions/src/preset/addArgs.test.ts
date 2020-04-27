import { StoryContext } from '@storybook/addons';
import { inferActionsFromArgTypesRegex, addActionsFromArgTypes } from './addArgs';

const withDefaultValue = (argTypes) =>
  Object.keys(argTypes).filter((key) => !!argTypes[key].defaultValue);

describe('actions parameter enhancers', () => {
  describe('actions.argTypesRegex parameter', () => {
    const baseParameters = {
      argTypes: { onClick: {}, onFocus: {}, somethingElse: {} },
      actions: { argTypesRegex: '^on.*' },
    };

    it('should add actions that match a pattern', () => {
      const parameters = baseParameters;
      const argTypes = inferActionsFromArgTypesRegex({ parameters } as StoryContext);
      expect(withDefaultValue(argTypes)).toEqual(['onClick', 'onFocus']);
    });

    it('should prioritize pre-existing argTypes unless they are null', () => {
      const parameters = {
        ...baseParameters,
        argTypes: {
          onClick: { defaultValue: 'pre-existing value' },
          onFocus: { defaultValue: null },
        },
      };
      const argTypes = inferActionsFromArgTypesRegex({ parameters } as StoryContext);
      expect(withDefaultValue(argTypes)).toEqual(['onClick', 'onFocus']);
      expect(argTypes.onClick.defaultValue).toEqual('pre-existing value');
      expect(argTypes.onFocus.defaultValue).not.toBeNull();
    });

    it('should do nothing if actions are disabled', () => {
      const parameters = {
        ...baseParameters,
        actions: { ...baseParameters.actions, disable: true },
      };
      const result = inferActionsFromArgTypesRegex({ parameters } as StoryContext);
      expect(result).toEqual(parameters.argTypes);
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
      const argTypes = addActionsFromArgTypes({ parameters } as StoryContext);
      expect(withDefaultValue(argTypes)).toEqual(['onClick', 'onBlur']);
    });

    it('should prioritize pre-existing args', () => {
      const parameters = {
        ...baseParameters,
        argTypes: {
          onClick: { defaultValue: 'pre-existing value', action: 'onClick' },
          onBlur: { action: 'onBlur' },
        },
      };
      const argTypes = addActionsFromArgTypes({ parameters } as StoryContext);
      expect(withDefaultValue(argTypes)).toEqual(['onClick', 'onBlur']);
      expect(argTypes.onClick.defaultValue).toEqual('pre-existing value');
    });

    it('should do nothing if actions are disabled', () => {
      const parameters = { ...baseParameters, actions: { disable: true } };
      const result = addActionsFromArgTypes({ parameters } as StoryContext);
      expect(result).toEqual(parameters.argTypes);
    });
  });
});
