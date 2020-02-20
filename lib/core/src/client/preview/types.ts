export interface PreviewError {
  message?: string;
  stack?: string;
}

// Copy of require.context
// interface RequireContext {
//   keys(): string[];
//   (id: string): any;
//   <T>(id: string): T;
//   resolve(id: string): string;
//   /** The module id of the context module. This may be useful for module.hot.accept. */
//   id: string;
// }

export type RequireContext = {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
};
export type LoaderFunction = () => void | any[];
export type Loadable = RequireContext | RequireContext[] | LoaderFunction;
