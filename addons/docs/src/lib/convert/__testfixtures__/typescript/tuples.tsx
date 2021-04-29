import React, { FC } from 'react';

interface ItemInterface {
  text: string;
  value: string;
}
interface Props {
  tupleOfPrimitive: [string, number];
  tupleWithComplexType: [string, ItemInterface];
}
export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
