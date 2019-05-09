import React from 'react';
import { styled } from '@storybook/theming';
import { PropDef } from './PropDef';
import { Tr, Td } from './Table';

enum PropType {
  Shape = 'shape',
  Union = 'union',
  ArrayOf = 'arrayOf',
  ObjectOf = 'objectOf',
  // Might be overkill to have below proptypes as separate components *shrug*
  Literal = 'literal',
  OneOf = 'enum',
  InstanceOf = 'instanceOf',
  Signature = 'signature',
}

interface PrettyPropTypeProps {
  type: any;
}

interface PrettyPropValProps {
  value: any;
}

interface PropRowProps {
  row: PropDef;
  // FIXME: row options
}

const Name = styled.span({ fontWeight: 'bold' });
const Required = styled.span({ color: 'red' });

export const PrettyPropType: React.FunctionComponent<PrettyPropTypeProps> = ({ type }) => (
  <span>{JSON.stringify(type)}</span>
);

export const PrettyPropVal: React.FunctionComponent<PrettyPropValProps> = ({ value }) => (
  <span>{JSON.stringify(value)}</span>
);

export const PropRow: React.FunctionComponent<PropRowProps> = ({
  row: { name, type, required, description, defaultValue },
}) => (
  <Tr>
    <Td>
      <Name>{name}</Name>
      {required ? <Required>*</Required> : null}
    </Td>
    <Td>
      {description}
      <br />
      <div>
        <PrettyPropType type={type} />
      </div>
    </Td>
    <Td>{defaultValue === undefined ? '-' : <PrettyPropVal value={defaultValue} />}</Td>
  </Tr>
);
