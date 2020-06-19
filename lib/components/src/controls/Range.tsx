import React, { FC, ChangeEvent } from 'react';

import { styled } from '@storybook/theming';
import { lighten } from 'polished';
import { ControlProps, NumberValue, RangeConfig } from './types';
import { parse } from './Number';

type RangeProps = ControlProps<NumberValue | null> & RangeConfig;

const thumbRadius = 8;
const thumbHeight = 16;
const thumbWidth = 16;
const thumbShadowSize = 2;
const thumbShadowBlur = 3;
const thumbBorderWidth = 1;
const thumbBorderColor = 'white';

const trackWidth = '100%';
const trackHeight = 4;
const trackShadowSize = 2;
const trackShadowBlur = 2;
const trackShadowColor = '#222';
const trackBorderWidth = 1;

const trackRadius = 5;
const contrast = '5%';

const RangeInput = styled.input(({ theme }) => ({
  appearance: 'none',
  margin: '18px 0',
  width: '100%',
  border: 'none',

  // background: 'green',

  // height: 24,

  // borderRadius: theme.appBorderRadius,
  // color: '#444',
  // display: 'table-cell',
  // flexGrow: 1,

  '&::-webkit-slider-runnable-track': {
    width: trackWidth,
    height: trackHeight,
    cursor: 'pointer',
    transition: 'all 150ms ease-out',

    background: `${theme.color.medium}`,
    borderRadius: trackRadius,
    border: `${trackBorderWidth}px solid ${theme.color.border}`,
  },

  '&::-webkit-slider-thumb': {
    boxShadow: `${thumbShadowSize}px ${thumbShadowSize}px ${thumbShadowBlur}px ${theme.color.border}`,
    border: `${thumbBorderWidth}px solid ${theme.color.border}`,
    height: thumbHeight,
    width: thumbWidth,
    borderRadius: thumbRadius,
    background: `${theme.color.lightest}`,
    cursor: 'pointer',
    appearance: 'none',
    marginTop: -1 * (thumbHeight / 2),
  },

  '&:focus': {
    outline: 'none',

    '&::-webkit-slider-runnable-track': {
      background: theme.background.app,
      borderColor: theme.color.secondary,
    },

    '&::-webkit-slider-thumb': {
      borderColor: theme.color.secondary,
      boxShadow: `0 0px 5px 0px ${theme.color.secondary}`,
    },
  },

  '&::-moz-range-track': {
    width: trackWidth,
    height: trackHeight,
    cursor: 'pointer',

    background: `${theme.color.medium}`,
    borderRadius: trackRadius,
    border: `${trackBorderWidth}px solid ${theme.color.border}`,
  },
  '&::-moz-range-thumb': {
    boxShadow: `${thumbShadowSize}px ${thumbShadowSize}px ${thumbShadowBlur}px ${theme.color.border}`,
    border: `${thumbBorderWidth}px solid ${theme.color.border}`,
    height: thumbHeight,
    width: thumbWidth,
    borderRadius: thumbRadius,
    background: `${theme.color.lightest}`,
    cursor: 'pointer',
  },

  '&::-ms-track': {
    width: '100%',
    height: '8.4px',
    cursor: 'pointer',
    background: 'transparent',
    borderColor: 'transparent',
    borderWidth: '16px 0',
    color: 'transparent',
  },
  '&::-ms-fill-lower': {
    background: '#2a6495',
    border: '0.2px solid #010101',
    bordeRadius: '2.6px',
  },
  '&::-ms-fill-upper': {
    background: '#3071a9',
    border: '0.2px solid #010101',
    borderRadius: '2.6px',
  },

  '&::-ms-thumb': {
    boxShadow: `${thumbShadowSize} ${thumbShadowSize} ${thumbShadowBlur} ${theme.color.border}`,
    border: `${thumbBorderWidth} solid ${theme.color.border}`,
    height: thumbHeight,
    width: thumbWidth,
    borderRadius: thumbRadius,
    background: theme.appContentBg,
    cursor: 'pointer',
  },

  '&:focus::-ms-fill-lower': {
    background: '#3071a9',
  },

  '&:focus::-ms-fill-upper': {
    background: lighten(contrast, theme.color.medium),
  },
}));

const RangeLabel = styled.span({
  paddingLeft: 5,
  paddingRight: 5,
  fontSize: 12,
  whiteSpace: 'nowrap',
});

const RangeWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const RangeControl: FC<RangeProps> = ({
  name,
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(name, parse(event.target.value));
  };
  return (
    <RangeWrapper>
      <RangeLabel>{min}</RangeLabel>
      <RangeInput
        value={value}
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
      <RangeLabel>{`${value} / ${max}`}</RangeLabel>
    </RangeWrapper>
  );
};
