import { StoryFn } from '@storybook/addons';
import { RenderNgAppService } from './angular-beta/RenderNgAppService';

import { renderNgApp } from './angular/helpers';
import { StoryFnAngularReturnType } from './types';
import { Parameters } from './types-6-0';

// add proper types
export default function render({
  storyFn,
  showMain,
  forceRender,
  parameters,
}: {
  storyFn: StoryFn<StoryFnAngularReturnType>;
  showMain: () => void;
  forceRender: boolean;
  parameters: Parameters;
}) {
  showMain();

  if (parameters.angularLegacyRendering) {
    renderNgApp(storyFn, forceRender);
    return;
  }

  RenderNgAppService.getInstance().render(storyFn, forceRender);
}
