import React, { useCallback, useMemo } from 'react';
import { styled, useTheme, Theme } from '@storybook/theming';

import { JsonTree, JsonTreeProps } from 'react-editable-json-tree';
import type { ControlProps, ObjectValue, ObjectConfig } from './types';

const Wrapper = styled.label({
  display: 'flex',
});

export type ObjectProps = ControlProps<ObjectValue> &
  ObjectConfig & {
    theme: any; // TODO: is there a type for this?
  };

const getCustomStyleFunction: (theme: Theme) => JsonTreeProps['getStyle'] = (theme) => (
  keyName,
  data,
  keyPath,
  deep,
  dataType
) => {
  const DEFAULT_FONT_SIZE = '13px';
  const DEFAULT_LINE_HEIGHT = '18px';
  const DEFAULT_PLUS_COLOR = theme.color.ancillary;
  const DEFAULT_MINUS_COLOR = theme.color.negative;
  const DEFAULT_TEXT_COLOR = theme.color.defaultText;
  const DEFAULT_COLLAPSED_COLOR = theme.color.dark;
  const DEFAULT_KEY_COLOR = theme.color.secondary; // Bright to invite clicking

  // Based on default styles provided by the library
  // https://github.com/oxyno-zeta/react-editable-json-tree/blob/master/src/utils/styles.js
  const objectStyle = {
    minus: {
      color: DEFAULT_MINUS_COLOR,
    },
    plus: {
      color: DEFAULT_PLUS_COLOR,
    },
    collapsed: {
      color: DEFAULT_COLLAPSED_COLOR,
    },
    delimiter: {},
    ul: {
      padding: '0px',
      margin: '0 0 0 25px',
      listStyle: 'none',
    },
    name: {
      color: DEFAULT_KEY_COLOR,
      fontSize: DEFAULT_FONT_SIZE,
      lineHeight: DEFAULT_LINE_HEIGHT,
    },
    addForm: {},
  };
  const arrayStyle = {
    minus: {
      color: DEFAULT_MINUS_COLOR,
    },
    plus: {
      color: DEFAULT_PLUS_COLOR,
    },
    collapsed: {
      color: DEFAULT_COLLAPSED_COLOR,
    },
    delimiter: {},
    ul: {
      padding: '0px',
      margin: '0 0 0 25px',
      listStyle: 'none',
    },
    name: {
      color: DEFAULT_TEXT_COLOR,
      fontSize: DEFAULT_FONT_SIZE,
      lineHeight: DEFAULT_LINE_HEIGHT,
    },
    addForm: {},
  };
  const valueStyle = {
    minus: {
      color: DEFAULT_MINUS_COLOR,
    },
    editForm: {},
    value: {
      color: theme.color.ultraviolet, // something colorful that invites clicking
      fontSize: DEFAULT_FONT_SIZE,
      lineHeight: DEFAULT_LINE_HEIGHT,
    },
    li: {
      minHeight: '22px',
      lineHeight: '22px',
      outline: '0px',
    },
    name: {
      color: DEFAULT_KEY_COLOR,
    },
  };

  switch (dataType) {
    case 'Object':
    case 'Error':
      return objectStyle;
    case 'Array':
      return arrayStyle;
    default:
      return valueStyle;
  }
};

export const ObjectControl: React.FC<ObjectProps> = ({ name, value = {}, onChange }) => {
  const handleChange = useCallback(
    (data: ObjectValue) => {
      onChange(data);
    },
    [onChange]
  );

  const theme = useTheme() as Theme;

  const customStyleFunction = useMemo(() => getCustomStyleFunction(theme), [theme]);

  return (
    <Wrapper>
      <JsonTree
        data={value}
        onFullyUpdate={handleChange}
        rootName="root"
        getStyle={customStyleFunction}
        cancelButtonElement={<button type="submit">cancel</button>}
        editButtonElement={<button type="submit">edit</button>}
      />
    </Wrapper>
  );
};
