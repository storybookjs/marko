import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ChipsModule } from './angular-src/chips.module';
import { ChipsGroupComponent } from './angular-src/chips-group.component';
import { CHIP_COLOR } from './angular-src/chip-color.token';

export default {
  title: 'Basics / NgModule / forRoot() pattern',
  component: ChipsGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [ChipsModule.forRoot()],
    }),
  ],
  args: {
    chips: [
      {
        id: 1,
        text: 'Chip 1',
      },
      {
        id: 2,
        text: 'Chip 2',
      },
    ],
  },
  argTypes: {
    removeChipClick: { action: 'Remove chip' },
    removeAllChipsClick: { action: 'Remove all chips clicked' },
  },
} as Meta;

const Template = (): Story => (args) => ({
  props: args,
});

export const Base = Template();
Base.storyName = 'Chips group';

export const WithCustomProvider = Template();
WithCustomProvider.decorators = [
  moduleMetadata({
    providers: [
      {
        provide: CHIP_COLOR,
        useValue: 'yellow',
      },
    ],
  }),
];
WithCustomProvider.storyName = 'Chips group with overridden provider';
