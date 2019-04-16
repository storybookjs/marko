import React from 'react';
import PropTypes from 'prop-types';
import createFragment from 'react-addons-create-fragment';

import { styled } from '@storybook/theming';

const ArrayVal = styled.span();
const AttrVal = styled.span();
const ObjectVal = styled.span();
const NumberVal = styled.span();
const StringVal = styled.span();
const BoolVal = styled.span();
const FunctionVal = styled.span();
const OtherVal = styled.span();
const EmptyVal = styled.span();

function indent(breakIntoNewLines, level, isBlock) {
  return (
    breakIntoNewLines && (
      <span>
        <br />
        {`${Array(level).join('  ')}  `}
        {!isBlock && '  '}
      </span>
    )
  );
}

function PreviewArray({ val, level, maxPropArrayLength, maxPropStringLength, maxPropsIntoLine }) {
  const items = {};
  const breakIntoNewLines = val.length > maxPropsIntoLine;
  val.slice(0, maxPropArrayLength).forEach((item, i) => {
    items[`n${i}`] = (
      <AttrVal>
        {indent(breakIntoNewLines, level)}
        <PropVal
          value={item}
          level={level + 1}
          maxPropStringLength={maxPropStringLength}
          maxPropsIntoLine={maxPropsIntoLine}
        />
      </AttrVal>
    );
    items[`c${i}`] = ',';
  });
  if (val.length > maxPropArrayLength) {
    items.last = (
      <span>
        {indent(breakIntoNewLines, level)}
        {'…'}
      </span>
    );
  } else {
    delete items[`c${val.length - 1}`];
  }

  return (
    <ArrayVal>
      [{createFragment(items)}
      {indent(breakIntoNewLines, level, true)}]
    </ArrayVal>
  );
}

PreviewArray.propTypes = {
  val: PropTypes.any, // eslint-disable-line
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
  maxPropsIntoLine: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
};

function PreviewObject({ val, level, maxPropObjectKeys, maxPropStringLength, maxPropsIntoLine }) {
  const names = Object.keys(val);
  const items = {};
  const breakIntoNewLines = names.length > maxPropsIntoLine;
  names.slice(0, maxPropObjectKeys).forEach((name, i) => {
    items[`k${i}`] = (
      <span>
        {indent(breakIntoNewLines, level)}
        <span>{name}</span>
      </span>
    );
    items[`c${i}`] = ': ';
    items[`v${i}`] = (
      <PropVal
        value={val[name]}
        level={level + 1}
        maxPropStringLength={maxPropStringLength}
        maxPropsIntoLine={maxPropsIntoLine}
      />
    );
    items[`m${i}`] = ',';
  });
  if (names.length > maxPropObjectKeys) {
    items.rest = (
      <span>
        {indent(breakIntoNewLines, level)}
        {'…'}
      </span>
    );
  } else {
    delete items[`m${names.length - 1}`];
  }
  return (
    <ObjectVal>
      {'{'}
      {createFragment(items)}
      {indent(breakIntoNewLines, level, true)}
      {'}'}
    </ObjectVal>
  );
}

PreviewObject.propTypes = {
  val: PropTypes.any, // eslint-disable-line
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
  maxPropsIntoLine: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
};

export const PropVal = ({
  value,
  level,
  maxPropObjectKeys,
  maxPropArrayLength,
  maxPropStringLength,
  maxPropsIntoLine,
}) => {
  let content = null;
  let val = value;
  if (typeof val === 'number') {
    content = <NumberVal>{val}</NumberVal>;
  } else if (typeof val === 'string') {
    if (val.length > maxPropStringLength) {
      val = `${val.slice(0, maxPropStringLength)}…`;
    }
    if (level > 1) {
      val = `'${val}'`;
    }
    content = <StringVal>{val}</StringVal>;
  } else if (typeof val === 'boolean') {
    content = <BoolVal>{`${val}`}</BoolVal>;
  } else if (Array.isArray(val)) {
    content = (
      <PreviewArray
        {...{
          val,
          level,
          maxPropArrayLength,
          maxPropStringLength,
          maxPropsIntoLine,
        }}
      />
    );
  } else if (typeof val === 'function') {
    content = <FunctionVal>{val.name || 'anonymous'}</FunctionVal>;
  } else if (!val) {
    content = <EmptyVal>{`${val}`}</EmptyVal>;
  } else if (typeof val !== 'object') {
    content = <OtherVal>…</OtherVal>;
  } else if (React.isValidElement(val)) {
    content = <ObjectVal>{`<${val.type.displayName || val.type.name || val.type} />`}</ObjectVal>;
  } else {
    content = (
      <PreviewObject
        {...{
          val,
          level,
          maxPropObjectKeys,
          maxPropStringLength,
          maxPropsIntoLine,
        }}
      />
    );
  }

  return content;
};

PropVal.defaultProps = {
  value: null,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
  maxPropsIntoLine: 3,
  level: 1,
};

PropVal.propTypes = {
  value: PropTypes.any, // eslint-disable-line
  maxPropObjectKeys: PropTypes.number,
  maxPropArrayLength: PropTypes.number,
  maxPropStringLength: PropTypes.number,
  maxPropsIntoLine: PropTypes.number,
  level: PropTypes.number,
};

export default PropVal;
