import { Story, Meta } from '@storybook/angular';
import EnumsComponent, {
  EnumNumeric,
  EnumNumericInitial,
  EnumStringValues,
} from './enums.component';

export default {
  title: 'Enum Types',
} as Meta;

const Template: Story<EnumsComponent> = (args) => ({
  component: EnumsComponent,
  props: args,
});

export const NoDefaults = Template.bind({});
NoDefaults.args = {};

export const WithDefaults = Template.bind({});
WithDefaults.args = {
  unionType: 'union a',
  aliasedUnionType: 'Type Alias 1',
  enumNumeric: EnumNumeric.FIRST,
  enumNumericInitial: EnumNumericInitial.UNO,
  enumStrings: EnumStringValues.PRIMARY,
  enumAlias: EnumNumeric.FIRST,
};
