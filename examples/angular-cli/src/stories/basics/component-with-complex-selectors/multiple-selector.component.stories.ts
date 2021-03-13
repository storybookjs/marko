import { MultipleSelectorComponent } from './multiple-selector.component';
import { AttributeSelectorComponent } from './attribute-selector.component';
import { AttributeWithValueSelectorComponent } from './attributewithvalue-selector.component';

export default {
  title: 'Basics / Component / With Complex Selectors',
};

export const MultipleSelectors = () => ({});

MultipleSelectors.storyName = 'multiple selectors';
MultipleSelectors.parameters = {
  component: MultipleSelectorComponent,
};

export const AttributeSelectors = () => ({});

AttributeSelectors.storyName = 'attribute selectors';
AttributeSelectors.parameters = {
  component: AttributeSelectorComponent,
};

export const AttributeValueSelectors = () => ({});

AttributeValueSelectors.storyName = 'attribute value selectors';
AttributeValueSelectors.parameters = {
  component: AttributeWithValueSelectorComponent,
};
