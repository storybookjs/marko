import { Inject, ChangeDetectorRef, Component, OnDestroy, OnInit, Type } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { ICollection } from '../types';
import { STORY_PROPS } from './app.token';
import { RenderNgAppService } from './RenderNgAppService';

/**
 * Wraps the story template into a component
 *
 * @param template {string}
 * @param styles {string[]}
 */
export const createComponentClassFromStoryTemplate = (
  template: string,
  styles: string[]
): Type<any> => {
  @Component({
    selector: RenderNgAppService.SELECTOR_STORYBOOK_WRAPPER,
    template,
    styles,
  })
  class StoryBookTemplateWrapperComponent implements OnInit, OnDestroy {
    private storyPropsSubscription: Subscription;

    // eslint-disable-next-line no-useless-constructor
    constructor(
      @Inject(STORY_PROPS) private storyProps$: Subject<ICollection | undefined>,
      private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
      // Subscribes to the observable storyProps$ to keep these properties up to date
      this.storyPropsSubscription = this.storyProps$.subscribe((storyProps = {}) => {
        // All props are added as component properties
        Object.assign(this, storyProps);

        this.changeDetectorRef.detectChanges();
        this.changeDetectorRef.markForCheck();
      });
    }

    ngOnDestroy(): void {
      if (this.storyPropsSubscription != null) {
        this.storyPropsSubscription.unsubscribe();
      }
    }
  }
  return StoryBookTemplateWrapperComponent;
};
