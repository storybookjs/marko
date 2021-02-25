import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TokenComponent, ITEMS, DEFAULT_NAME } from './angular-src/token.component';

export default {
  title: 'Core / ModuleMetadata / In export default with decorator',
  decorators: [
    moduleMetadata({
      imports: [],
      declarations: [TokenComponent],
      providers: [
        {
          provide: ITEMS,
          useValue: ['Joe', 'Jane'],
        },
        {
          provide: DEFAULT_NAME,
          useValue: 'Provider Name',
        },
      ],
    }),
  ],
} as Meta;

export const Story1: Story = () => ({
  template: `<storybook-simple-token-component [name]="name"></storybook-simple-token-component>`,
  props: {
    name: 'Prop Name',
  },
});

Story1.storyName = 'Story 1';

export const Story2: Story = () => ({
  template: `<storybook-simple-token-component></storybook-simple-token-component>`,
});

Story2.storyName = 'Story 2';
