import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

import PrettyPropType from './types/PrettyPropType';
import { PropVal } from './PropVal';

export const multiLineText = input => {
  if (!input) {
    return input;
  }
  const text = String(input);
  const arrayOfText = text.split(/\r?\n|\r/g);
  const isSingleLine = arrayOfText.length < 2;
  return isSingleLine
    ? text
    : arrayOfText.map((lineOfText, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={`${lineOfText}.${i}`}>
          {i > 0 && <br />} {lineOfText}
        </span>
      ));
};

const Table = styled.table({
  width: '100%',
  textAlign: 'left',
  borderCollapse: 'collapse',
  borderLeft: '0px',
  borderRight: '0px',
});
const Thead = styled.thead(({ theme }) => ({
  textTransform: 'capitalize',
  color: '#ffffff', // theme.color.textInverseColor,
  backgroundColor: theme.color.darkest,
}));
const Tbody = styled.tbody();
const Th = styled.th({
  paddingTop: '.5rem',
  paddingBottom: '.5rem',
});
const Tr = styled.tr({});
const Td = styled.td(({ theme }) => ({
  color: theme.color.defaultText,
  paddingTop: '1rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #cccccc',
}));
const Name = styled.span({ fontWeight: 'bold' });
const Required = styled.span({ color: 'red' });

const PropRow = ({ row, propValOptions }) => (
  <Tr key={row.property}>
    <Td>
      <Name>{row.property}</Name>
      {row.required ? <Required>*</Required> : null}
    </Td>
    <Td>
      {multiLineText(row.description)}
      <br />
      <div className="info-table-monospace">
        <PrettyPropType propType={row.propType} />
      </div>
    </Td>
    <Td>
      {row.defaultValue === undefined ? (
        '-'
      ) : (
        <PropVal value={row.defaultValue} {...propValOptions} valueStyles={{}} />
      )}
    </Td>
  </Tr>
);

PropRow.propTypes = {
  row: PropTypes.shape({
    property: PropTypes.string.isRequired,
    propType: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    required: PropTypes.bool,
    description: PropTypes.string,
    defaultValue: PropTypes.any,
  }).isRequired,
  propValOptions: PropTypes.shape({
    maxPropObjectKeys: PropTypes.number.isRequired,
    maxPropArrayLength: PropTypes.number.isRequired,
    maxPropStringLength: PropTypes.number.isRequired,
  }).isRequired,
};

export const PropTable = ({
  maxPropObjectKeys,
  maxPropArrayLength,
  maxPropStringLength,
  propDefinitions,
  excludedPropTypes,
}) => {
  const includedPropDefinitions =
    !excludedPropTypes || !excludedPropTypes.length
      ? propDefinitions
      : propDefinitions.filter(def => !excludedPropTypes.includes(def.property));

  if (!includedPropDefinitions.length) {
    return <small>No propTypes defined!</small>;
  }

  const propValOptions = {
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
  };

  return (
    <Table className="props-table">
      <Thead>
        <Tr>
          <Th>name</Th>
          <Th>description</Th>
          <Th>default</Th>
        </Tr>
      </Thead>
      <Tbody>
        {includedPropDefinitions.map(row => (
          <PropRow row={row} propValOptions={propValOptions} />
        ))}
      </Tbody>
    </Table>
  );
};

PropTable.displayName = 'PropTable';

PropTable.defaultProps = {
  maxPropObjectKeys: 5,
  maxPropArrayLength: 5,
  maxPropStringLength: 50,
  propDefinitions: [],
  excludedPropTypes: [],
};

PropTable.propTypes = {
  maxPropObjectKeys: PropTypes.number,
  maxPropArrayLength: PropTypes.number,
  maxPropStringLength: PropTypes.number,
  excludedPropTypes: PropTypes.arrayOf(PropTypes.string),
  propDefinitions: PropTypes.arrayOf(PropRow.propTypes.row),
};
