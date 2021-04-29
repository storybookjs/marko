import { FormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { CustomCvaComponent } from './custom-cva.component';

export default {
  title: 'Basics / Angular forms / ControlValueAccessor',
  component: CustomCvaComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
    }),
  ],
} as Meta;

export const SimpleInput: Story = () => ({
  props: {
    ngModel: 'Type anything',
    ngModelChange: action('ngModelChange'),
  },
});

SimpleInput.storyName = 'Simple input';
