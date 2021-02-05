import { withKnobs, text } from '@storybook/addon-knobs';
import { DiComponent } from './di.component';

export default {
  title: 'Basics / Component with / Provider',
  component: DiComponent,
};

export const InputsAndInjectDependencies = () => ({
  props: {
    title: 'Component dependencies',
  },
});

InputsAndInjectDependencies.storyName = 'inputs and inject dependencies';

export const InputsAndInjectDependenciesWithKnobs = () => ({
  props: {
    title: text('title', 'Component dependencies'),
  },
});

InputsAndInjectDependenciesWithKnobs.storyName = 'inputs and inject dependencies with knobs';
InputsAndInjectDependenciesWithKnobs.decorators = [withKnobs];
