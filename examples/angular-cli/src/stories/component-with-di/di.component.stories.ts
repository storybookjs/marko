import { withKnobs, text } from '@storybook/addon-knobs';
import { DiComponent } from './di.component';

export default {
  title: 'Custom/Dependencies',
};

export const InputsAndInjectDependencies = () => ({
  component: DiComponent,
  props: {
    title: 'Component dependencies',
  },
});

InputsAndInjectDependencies.storyName = 'inputs and inject dependencies';

export const InputsAndInjectDependenciesWithKnobs = () => ({
  component: DiComponent,
  props: {
    title: text('title', 'Component dependencies'),
  },
});

InputsAndInjectDependenciesWithKnobs.storyName = 'inputs and inject dependencies with knobs';
InputsAndInjectDependenciesWithKnobs.decorators = [withKnobs];
