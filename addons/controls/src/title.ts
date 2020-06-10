import { useArgTypes } from '@storybook/api';

export function getTitle(): string {
  const rows = useArgTypes();

  const controlsCount = Object.values(rows).filter((argType) => argType?.control?.type).length;

  if (controlsCount === 0) {
    return 'Controls';
  }

  return `Controls (${controlsCount})`;
}
