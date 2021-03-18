import React, { FC, useCallback, useMemo, useState } from 'react';
import { HexColorPicker, HslaStringColorPicker, RgbaStringColorPicker } from 'react-colorful';
import convert from 'color-convert';
import throttle from 'lodash/throttle';

import { styled } from '@storybook/theming';
import { ControlProps, ColorValue, ColorConfig } from './types';
import { WithTooltip } from '../tooltip/lazy-WithTooltip';
import { Form } from '../form';
import { Icons } from '../icon/icon';

enum ColorSpace {
  RGBA = 'rgb',
  HSLA = 'hsl',
  HEX = 'hex',
}

const COLOR_SPACES = Object.values(ColorSpace);
const COLOR_REGEXP = /\(([0-9]+),\s*([0-9]+)%?,\s*([0-9]+)%?,?\s*([0-9.]+)?\)/;
const HEX_REGEXP = /#([0-9a-f])([0-9a-f])([0-9a-f])/i;

type ParsedColor = {
  value: string;
  colorSpace: ColorSpace;
  [ColorSpace.RGBA]: string;
  [ColorSpace.HSLA]: string;
  [ColorSpace.HEX]: string;
};

const stringToArgs = (value: string) => {
  const match = value?.match(COLOR_REGEXP);
  if (!match) return [0, 0, 0, 1];
  const [, x, y, z, a = 1] = match;
  return [x, y, z, a].map(Number);
};

const expandShorthand = (value: string) => {
  if (value && !value.startsWith('#')) return `#${convert.keyword.hex(value)}`;
  if (!value || value.length > 4) return value || '#000000';
  const match = value.match(HEX_REGEXP);
  if (!match) return value;
  const [, r, g, b] = match;
  return `#${r}${r}${g}${g}${b}${b}`;
};

const parseValue = (value: string): ParsedColor => {
  if (!value) return undefined;

  if (value.startsWith('rgb')) {
    const [r, g, b, a] = stringToArgs(value);
    const [h, s, l] = convert.rgb.hsl(r, g, b) || [0, 0, 0];
    return {
      value,
      colorSpace: ColorSpace.RGBA,
      [ColorSpace.RGBA]: value,
      [ColorSpace.HSLA]: `hsla(${h}, ${s}, ${l}, ${a})`,
      [ColorSpace.HEX]: `#${convert.rgb.hex(r, g, b)}`,
    };
  }

  if (value.startsWith('hsl')) {
    const [h, s, l, a] = stringToArgs(value);
    const [r, g, b] = convert.hsl.rgb(h, s, l) || [0, 0, 0];
    return {
      value,
      colorSpace: ColorSpace.HSLA,
      [ColorSpace.RGBA]: `rgba(${r}, ${g}, ${b}, ${a})`,
      [ColorSpace.HSLA]: value,
      [ColorSpace.HEX]: `#${convert.hsl.hex(h, s, l)}`,
    };
  }

  const convertTo = value.startsWith('#') ? convert.hex : convert.keyword;
  const [r, g, b] = convertTo.rgb(value.replace('#', '')) || [0, 0, 0];
  const [h, s, l] = convert.rgb.hsl(r, g, b) || [0, 0, 0];
  return {
    value,
    colorSpace: ColorSpace.HEX,
    [ColorSpace.RGBA]: `rgba(${r}, ${g}, ${b}, 1)`,
    [ColorSpace.HSLA]: `hsla(${h}, ${s}, ${l}, 1)`,
    [ColorSpace.HEX]: value,
  };
};

const Wrapper = styled.div({
  position: 'relative',
  maxWidth: 230,
});

const PickerTooltip = styled(WithTooltip)({
  position: 'absolute',
  zIndex: 1,
  top: 4,
  left: 4,
});

const Swatch = styled.div<{}>(({ theme }) => ({
  width: 16,
  height: 16,
  margin: 4,
  boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  borderRadius: '1rem',
}));

const Input = styled(Form.Input)({
  width: '100%',
  paddingLeft: 30,
  paddingRight: 30,
});

const ToggleIcon = styled(Icons)({
  position: 'absolute',
  zIndex: 1,
  top: 6,
  right: 7,
  width: 20,
  height: 20,
  padding: 4,
  cursor: 'pointer',
});

const SmartPicker: FC<{ value: string; colorSpace: ColorSpace }> = React.memo(
  ({ value, colorSpace, ...props }) => {
    switch (colorSpace) {
      case ColorSpace.RGBA:
        return <RgbaStringColorPicker color={value} {...props} />;
      case ColorSpace.HSLA:
        return <HslaStringColorPicker color={value} {...props} />;
      default:
        return <HexColorPicker color={expandShorthand(value)} {...props} />;
    }
  }
);

export type ColorProps = ControlProps<ColorValue> & ColorConfig;
export const ColorControl: FC<ColorProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  presetColors,
}) => {
  const color = useMemo(() => parseValue(value), [value]);
  const update = useMemo(() => throttle(onChange, 200), []);
  const [colorSpace, setColorSpace] = useState(color?.colorSpace || ColorSpace.HEX);
  const currentValue = color?.[colorSpace] || '';

  const cycleColorSpace = useCallback(() => {
    let next = COLOR_SPACES.indexOf(colorSpace) + 1;
    if (next >= COLOR_SPACES.length) next = 0;
    setColorSpace(COLOR_SPACES[next]);
  }, [colorSpace]);

  return (
    <Wrapper>
      <PickerTooltip
        trigger="click"
        tooltip={
          <div style={{ margin: 5 }}>
            <SmartPicker
              value={currentValue}
              {...{ colorSpace, onChange: update, onFocus, onBlur }}
            />
          </div>
        }
        closeOnClick
      >
        <Swatch style={{ background: currentValue || '#000000' }} />
      </PickerTooltip>
      <Input
        value={currentValue}
        onChange={(e: any) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        placeholder="Choose color"
      />
      <ToggleIcon icon="markup" onClick={cycleColorSpace} />
    </Wrapper>
  );
};

export default ColorControl;
