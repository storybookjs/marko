import React, { FC, ChangeEvent, RefObject, useState, useRef, useEffect } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '../form';
import { ControlProps, DateValue, DateConfig } from './types';

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-');
  const result = new Date();
  result.setFullYear(parseInt(year, 10));
  result.setMonth(parseInt(month, 10) - 1);
  result.setDate(parseInt(day, 10));
  return result;
};

const parseTime = (value: string) => {
  const [hours, minutes] = value.split(':');
  const result = new Date();
  result.setHours(parseInt(hours, 10));
  result.setMinutes(parseInt(minutes, 10));
  return result;
};

const formatDate = (value: Date | number) => {
  const date = new Date(value);
  const year = `000${date.getFullYear()}`.slice(-4);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

const formatTime = (value: Date | number) => {
  const date = new Date(value);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  return `${hours}:${minutes}`;
};

const FlexSpaced = styled.div({
  flex: 1,
  display: 'flex',
  '&& > *': {
    marginLeft: 10,
  },
  '&& > *:first-of-type': {
    marginLeft: 0,
  },
});
const FlexInput = styled(Form.Input)({
  flex: 1,
  '&::-webkit-calendar-picker-indicator': {
    opacity: 0.5,
  },
});

export type DateProps = ControlProps<DateValue> & DateConfig;
export const DateControl: FC<DateProps> = ({ name, value, onChange }) => {
  const [valid, setValid] = useState(true);
  const dateRef = useRef<HTMLInputElement>();
  const timeRef = useRef<HTMLInputElement>();
  useEffect(() => {
    if (valid !== false) {
      if (dateRef && dateRef.current) {
        dateRef.current.value = formatDate(value);
      }
      if (timeRef && timeRef.current) {
        timeRef.current.value = formatTime(value);
      }
    }
  }, [value]);

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseDate(e.target.value);
    const result = new Date(value);
    result.setFullYear(parsed.getFullYear());
    result.setMonth(parsed.getMonth());
    result.setDate(parsed.getDate());
    const time = result.getTime();
    if (time) onChange(name, time);
    setValid(!!time);
  };

  const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseTime(e.target.value);
    const result = new Date(value);
    result.setHours(parsed.getHours());
    result.setMinutes(parsed.getMinutes());
    const time = result.getTime();
    if (time) onChange(name, time);
    setValid(!!time);
  };

  return (
    <FlexSpaced>
      <FlexInput
        type="date"
        max="9999-12-31" // I do this because of a rendering bug in chrome
        ref={dateRef as RefObject<HTMLInputElement>}
        id={`${name}date`}
        name={`${name}date`}
        onChange={onDateChange}
      />
      <FlexInput
        type="time"
        id={`${name}time`}
        name={`${name}time`}
        ref={timeRef as RefObject<HTMLInputElement>}
        onChange={onTimeChange}
      />
      {!valid ? <div>invalid</div> : null}
    </FlexSpaced>
  );
};
