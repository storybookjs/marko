import { useArgTypes } from '@storybook/api';

export function getTitle(): string {
  const rows = useArgTypes();
  const controlsCount = Object.values(rows).filter((argType) => argType?.control).length;
  const suffix = controlsCount === 0 ? '' : ` (${controlsCount})`;
  return `Controls${suffix}`;
}
