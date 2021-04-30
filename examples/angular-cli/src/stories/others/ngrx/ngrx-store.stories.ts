import { Store, StoreModule } from '@ngrx/store';
import { Component } from '@angular/core';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

@Component({
  selector: 'storybook-comp-with-store',
  template: '<div>{{this.getStoreState()}}</div>',
})
class WithStoreComponent {
  private store: Store<any>;

  constructor(store: Store<any>) {
    this.store = store;
  }

  getStoreState() {
    return this.store === undefined ? 'Store is NOT injected' : 'Store is injected';
  }
}

export default {
  title: 'Others / NgRx / Store',
  decorators: [
    moduleMetadata({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: true,
              strictActionImmutability: true,
              strictStateSerializability: true,
              strictActionSerializability: true,
            },
          }
        ),
      ],
      declarations: [WithStoreComponent],
    }),
  ],
} as Meta;

export const WithComponent: Story = () => ({
  component: WithStoreComponent,
});

export const WithTemaplte: Story = () => ({
  template: `<storybook-comp-with-store></storybook-comp-with-store>`,
});
