import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { HexColorPicker, HslaStringColorPicker, RgbaStringColorPicker } from 'react-colorful';
import convert from 'color-convert';
import throttle from 'lodash/throttle';

import { styled } from '@storybook/theming';
import { ControlProps, ColorValue, ColorConfig } from './types';
import { TooltipNote } from '../tooltip/TooltipNote';
import { WithTooltip } from '../tooltip/lazy-WithTooltip';
import { Form } from '../form';
import { Icons } from '../icon/icon';

enum ColorSpace {
  RGB = 'rgb',
  HSL = 'hsl',
  HEX = 'hex',
}

const COLOR_SPACES = Object.values(ColorSpace);
const COLOR_REGEXP = /\(([0-9]+),\s*([0-9]+)%?,\s*([0-9]+)%?,?\s*([0-9.]+)?\)/;
const RGB_REGEXP = /^\s*rgba?\(([0-9]+),\s*([0-9]+),\s*([0-9]+),?\s*([0-9.]+)?\)\s*$/i;
const HSL_REGEXP = /^\s*hsla?\(([0-9]+),\s*([0-9]+)%,\s*([0-9]+)%,?\s*([0-9.]+)?\)\s*$/i;
const HEX_REGEXP = /^\s*#?([0-9a-f]{3}|[0-9a-f]{6})\s*$/i;
const SHORTHEX_REGEXP = /^\s*#?([0-9a-f]{3})\s*$/i;

type ParsedColor = {
  value: string;
  title: string;
  colorSpace: ColorSpace;
  [ColorSpace.RGB]: string;
  [ColorSpace.HSL]: string;
  [ColorSpace.HEX]: string;
};

const stringToArgs = (value: string) => {
  const match = value?.match(COLOR_REGEXP);
  if (!match) return [0, 0, 0, 1];
  const [, x, y, z, a = 1] = match;
  return [x, y, z, a].map(Number);
};

const expandShorthand = (value: string) => {
  if (!value) return '#000000';
  if (!value.startsWith('#')) {
    try {
      return `#${convert.keyword.hex(value as any)}`;
    } catch (e) {
      return value;
    }
  }
  if (value.length > 4) return value;
  const match = value.match(SHORTHEX_REGEXP);
  if (!match) return value;
  const [r, g, b] = match[1].split('');
  return `#${r}${r}${g}${g}${b}${b}`;
};

const parseValue = (input: string | { color: string; title?: string }): ParsedColor => {
  const { color, title } = typeof input === 'object' ? input : { color: input, title: undefined };
  if (!color) return undefined;

  if (RGB_REGEXP.test(color)) {
    const [r, g, b, a] = stringToArgs(color);
    const [h, s, l] = convert.rgb.hsl([r, g, b]) || [0, 0, 0];
    return {
      value: color,
      title: title || convert.rgb.keyword([r, g, b]) || color,
      colorSpace: ColorSpace.RGB,
      [ColorSpace.RGB]: color,
      [ColorSpace.HSL]: `hsla(${h}, ${s}%, ${l}%, ${a})`,
      [ColorSpace.HEX]: `#${convert.rgb.hex([r, g, b])}`,
    };
  }

  if (HSL_REGEXP.test(color)) {
    const [h, s, l, a] = stringToArgs(color);
    const [r, g, b] = convert.hsl.rgb([h, s, l]) || [0, 0, 0];
    return {
      value: color,
      title: title || convert.rgb.keyword([r, g, b]) || color,
      colorSpace: ColorSpace.HSL,
      [ColorSpace.RGB]: `rgba(${r}, ${g}, ${b}, ${a})`,
      [ColorSpace.HSL]: color,
      [ColorSpace.HEX]: `#${convert.hsl.hex([h, s, l])}`,
    };
  }

  const plain = color.replace('#', '');
  const fromKeyword = convert.keyword.rgb(plain as any);
  const rgb = fromKeyword || convert.hex.rgb(plain as any);
  const hsl = convert.rgb.hsl(rgb);

  let value = color;
  if (fromKeyword || /[^#a-f0-9]/.test(color)) value = plain;
  else if (HEX_REGEXP.test(color)) value = `#${plain}`;

  return {
    value,
    title: title || convert.rgb.keyword(rgb) || color,
    colorSpace: ColorSpace.HEX,
    [ColorSpace.RGB]: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
    [ColorSpace.HSL]: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`,
    [ColorSpace.HEX]: value,
  };
};

const Wrapper = styled.div({
  position: 'relative',
  maxWidth: 250,
});

const PickerTooltip = styled(WithTooltip)({
  position: 'absolute',
  zIndex: 1,
  top: 4,
  left: 4,
});

const TooltipContent = styled.div({
  margin: 5,

  '.react-colorful__saturation': {
    borderRadius: '4px 4px 0 0',
  },
  '.react-colorful__hue': {
    boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 5%)',
  },
  '.react-colorful__last-control': {
    borderRadius: '0 0 4px 4px',
  },
});

const Swatches = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(9, 15px)',
  gap: 7,
  padding: 3,
  marginTop: 5,
  width: 200,
});

const Swatch = styled.div<{ active?: boolean; round?: boolean }>(({ theme, active, round }) => ({
  width: round ? 16 : 15,
  height: round ? 16 : 15,
  margin: round ? 4 : 0,
  boxShadow: active
    ? `${theme.appBorderColor} 0 0 0 1px inset, ${theme.color.mediumdark}55 0 0 0 4px`
    : `${theme.appBorderColor} 0 0 0 1px inset`,
  borderRadius: round ? 16 : theme.appBorderRadius,
  cursor: 'pointer',
}));

const Input = styled(Form.Input)({
  width: '100%',
  paddingLeft: 30,
  paddingRight: 30,
});

const ToggleIcon = styled(Icons)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  top: 6,
  right: 7,
  width: 20,
  height: 20,
  padding: 4,
  cursor: 'pointer',
  color: theme.input.color,
}));

const SmartPicker: FC<{ value: string; colorSpace: ColorSpace }> = React.memo(
  ({ value, colorSpace, ...props }) => {
    switch (colorSpace) {
      case ColorSpace.RGB:
        return <RgbaStringColorPicker color={value} {...props} />;
      case ColorSpace.HSL:
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
  startOpen,
}) => {
  const color = useMemo(() => parseValue(value), [value]);
  const update = useMemo(() => throttle(onChange, 200), []);
  const [colorSpace, setColorSpace] = useState(color?.colorSpace || ColorSpace.HEX);
  const currentValue = color?.[colorSpace] || '';

  useEffect(() => {
    if (!currentValue) setColorSpace(ColorSpace.HEX);
  }, [currentValue]);

  const cycleColorSpace = useCallback(() => {
    let next = COLOR_SPACES.indexOf(colorSpace) + 1;
    if (next >= COLOR_SPACES.length) next = 0;
    setColorSpace(COLOR_SPACES[next]);
  }, [colorSpace]);

  const [presets, setPresets] = useState(() =>
    (presetColors || []).map(parseValue).concat(color).filter(Boolean).slice(0, 27)
  );
  const addPreset = useCallback((preset) => {
    setPresets((arr) =>
      preset?.rgb && arr.every((item) => item.rgb !== preset.rgb)
        ? arr.concat(preset).slice(-27)
        : arr
    );
  }, []);

  return (
    <Wrapper>
      <PickerTooltip
        trigger="click"
        startOpen={startOpen}
        closeOnClick
        onVisibilityChange={() => color && addPreset(color)}
        tooltip={
          <TooltipContent>
            <SmartPicker
              value={currentValue}
              {...{ colorSpace, onChange: update, onFocus, onBlur }}
            />
            {presets.length > 0 && (
              <Swatches>
                {presets.map((preset) => (
                  <WithTooltip
                    key={preset.value}
                    hasChrome={false}
                    tooltip={<TooltipNote note={preset.title} />}
                  >
                    <Swatch
                      style={{ background: preset[colorSpace] }}
                      active={color?.rgb === preset.rgb}
                      onClick={() => onChange(preset[colorSpace])}
                    />
                  </WithTooltip>
                ))}
              </Swatches>
            )}
          </TooltipContent>
        }
      >
        <Swatch round style={{ background: currentValue || '#000000' }} />
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
