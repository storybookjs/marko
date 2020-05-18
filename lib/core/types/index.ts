type ReactDocgen = 'react-docgen' | 'react-docgen-typescript' | false;

export interface StorybookOptions {
  typescriptOptions?: {
    reactDocgen?: ReactDocgen;
    reactDocgenTypescriptOptions?: any;
    check?: boolean;
    checkOptions?: any;
  };
}
