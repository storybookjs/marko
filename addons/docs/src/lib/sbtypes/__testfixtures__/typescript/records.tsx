import React, { FC } from 'react';

interface ItemInterface {
  text: string;
  value: string;
}
interface Props {
  recordOfPrimitive: Record<string, number>;
  recordOfComplexObject: Record<string, ItemInterface>;
}
export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
