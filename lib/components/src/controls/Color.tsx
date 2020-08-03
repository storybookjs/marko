import React, { FC, useState, MouseEvent, KeyboardEvent } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import { styled } from '@storybook/theming';
import { Form } from '../form';
import { ControlProps, ColorValue, ColorConfig } from './types';

const Swatch = styled.div<{}>(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: 6,
  width: 16,
  height: 16,
  boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  borderRadius: '1rem',
}));

const ColorButton = styled(Form.Button)<{ active: boolean }>(({ active }) => ({
  zIndex: active ? 3 : 'unset',
  width: '100%',
}));

const Popover = styled.div({
  position: 'absolute',
  zIndex: 2,
});

const format = (color: ColorResult) =>
  `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;

export type ColorProps = ControlProps<ColorValue> & ColorConfig;
export const ColorControl: FC<ColorProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  presetColors,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <ColorButton
      active={showPicker}
      type="button"
      name={name}
      onClick={() => setShowPicker(!showPicker)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          setShowPicker(!showPicker);
        }
      }}
      size="flex"
    >
      {value ? value.toUpperCase() : 'Choose color'}
      <Swatch style={{ background: value }} />
      {showPicker ? (
        <Popover
          onClick={(e: MouseEvent) => {
            // @ts-ignore
            if (e.target.tagName === 'INPUT') {
              e.stopPropagation();
            }
          }}
        >
          <SketchPicker
            color={value}
            onChange={(color: ColorResult) => onChange(format(color))}
            {...{ onFocus, onBlur, presetColors }}
          />
        </Popover>
      ) : null}
    </ColorButton>
  );
};
