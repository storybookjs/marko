export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}

export interface ICollection {
  [p: string]: any;
}

export interface NgStory {
  component?: any;
  props: ICollection;
  /** @deprecated `propsMeta` story input is deprecated, and will be removed in Storybook 7.0. */
  propsMeta?: ICollection;
  moduleMetadata?: NgModuleMetadata;
  template?: string;
}
