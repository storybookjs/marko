import { FormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { CustomCvaComponent } from './custom-cva.component';

export default {
  title: 'Custom/ngModel',
  component: CustomCvaComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
    }),
  ],
};

export const CustomControlValueAccessor = () => ({
  props: {
    ngModel: 'Type anything',
    ngModelChange: action('ngModelChange'),
  },
});

CustomControlValueAccessor.storyName = 'custom ControlValueAccessor';
