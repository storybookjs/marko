import {
  Component,
  Inject,
  InjectionToken,
  Injector,
  Input,
  OnInit,
  Optional,
  Type,
} from '@angular/core';
import { componentWrapperDecorator, moduleMetadata, Story, Meta } from '@storybook/angular';

const WITHOUT_SELECTOR_DATA = new InjectionToken<{ color: string; name: string }>(
  'WITHOUT_SELECTOR_DATA'
);

@Component({
  template: `My name in color :
    <div [style.color]="color">{{ name }}</div>
    <ng-content></ng-content> <ng-content></ng-content>`,
})
class WithoutSelectorComponent {
  color = '#1e88e5';

  name = 'Joe Bar';

  constructor(
    @Inject(WITHOUT_SELECTOR_DATA)
    @Optional()
    data: {
      color: string;
      name: string;
    } | null
  ) {
    if (data) {
      this.color = data.color;
      this.name = data.name;
    }
  }
}

export default {
  title: 'Basics / Component / without selector',
  component: WithoutSelectorComponent,
  decorators: [
    moduleMetadata({
      entryComponents: [WithoutSelectorComponent],
    }),
  ],
} as Meta;

export const SimpleComponent: Story = () => ({});

// Live changing of args by controls does not work for now. When changing args storybook does not fully
// reload and therefore does not take into account the change of provider.
export const WithInjectionTokenAndArgs: Story = (args) => ({
  props: args,
  moduleMetadata: {
    providers: [
      { provide: WITHOUT_SELECTOR_DATA, useValue: { color: args.color, name: args.name } },
    ],
  },
});
WithInjectionTokenAndArgs.argTypes = {
  name: { control: 'text' },
  color: { control: 'color' },
};
WithInjectionTokenAndArgs.args = { name: 'Dixie Normous', color: 'red' };

// Advanced example with custom *ngComponentOutlet

@Component({
  selector: 'without-selector-wrapper',
  template: `<ng-container
    *ngComponentOutlet="componentOutlet; injector: componentInjector; content: componentContent"
  ></ng-container>`,
})
class WithoutSelectorWrapperComponent implements OnInit {
  @Input()
  componentOutlet: Type<unknown>;

  @Input()
  name: string;

  @Input()
  color: string;

  componentInjector: Injector;

  componentContent = [
    // eslint-disable-next-line no-undef
    [document.createTextNode('Ng-content : Inspired by ')],
    // eslint-disable-next-line no-undef
    [document.createTextNode('https://angular.io/api/common/NgComponentOutlet')],
  ];

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly injector: Injector) {}

  ngOnInit(): void {
    console.log({ color: this.color, name: this.name });

    this.componentInjector = Injector.create({
      providers: [
        { provide: WITHOUT_SELECTOR_DATA, useValue: { color: this.color, name: this.name } },
      ],
      parent: this.injector,
    });
  }
}

// Live changing of args by controls does not work at the moment. When changing args storybook does not fully
// reload and therefore does not take into account the change of provider.
export const WithCustomNgComponentOutletWrapper: Story = (args) => ({
  props: args,
});
WithCustomNgComponentOutletWrapper.argTypes = {
  name: { control: 'text' },
  color: { control: 'color' },
};
WithCustomNgComponentOutletWrapper.args = { name: 'Dixie Normous', color: 'green' };
WithCustomNgComponentOutletWrapper.decorators = [
  moduleMetadata({
    declarations: [WithoutSelectorWrapperComponent],
  }),
  componentWrapperDecorator(WithoutSelectorWrapperComponent, (args) => ({
    name: args.name,
    color: args.color,
    componentOutlet: WithoutSelectorComponent,
  })),
];
