import type { ArgTypes } from '@storybook/addons';
import pickBy from 'lodash/pickBy';

export type PropDescriptor = string[] | RegExp;

const matches = (name: string, descriptor: PropDescriptor) =>
  Array.isArray(descriptor) ? descriptor.includes(name) : name.match(descriptor);

export const filterArgTypes = (
  argTypes: ArgTypes,
  include?: PropDescriptor,
  exclude?: PropDescriptor
) => {
  if (!include && !exclude) {
    return argTypes;
  }
  return (
    argTypes &&
    pickBy(argTypes, (argType, key) => {
      const name = argType.name || key;
      return (!include || matches(name, include)) && (!exclude || !matches(name, exclude));
    })
  );
};
