import { moduleMetadata } from '@storybook/angular';
import { TokenComponent, ITEMS, DEFAULT_NAME } from './angular-src/token.component';
import { CustomPipePipe } from './angular-src/custom.pipe';

export default {
  title: 'Basics / ModuleMetadata / Merge default and story',
  decorators: [
    moduleMetadata({
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
};

export const MergeWithDefaultModuleMetadata = () => ({
  template: `<storybook-simple-token-component [name]="name | customPipe"></storybook-simple-token-component>`,
  props: {
    name: 'Prop Name',
  },
  moduleMetadata: {
    declarations: [CustomPipePipe],
    providers: [],
  },
});
MergeWithDefaultModuleMetadata.storyName = 'Merge with default ModuleMetadata';
