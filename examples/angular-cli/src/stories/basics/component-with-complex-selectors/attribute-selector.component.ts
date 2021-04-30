import { Component } from '@angular/core';

@Component({
  selector: 'storybook-attribute-selector[foo=bar]',
  template: `<h3>Attribute selector</h3>
    Selector: "storybook-attribute-selector[foo=bar]" <br />
    Generated template: "&lt;storybook-attribute-selector
    foo="bar">&lt;/storybook-attribute-selector>" `,
})
export class AttributeSelectorComponent {}
