interface QueryParamsOptions {
  addDecorator?: boolean;
}

export function config(entry: any[] = [], { addDecorator = true }: QueryParamsOptions = {}) {
  const queryParamsConfig = [];
  if (addDecorator) {
    queryParamsConfig.push(require.resolve('./addDecorator'));
  }
  return [...entry, ...queryParamsConfig];
}
