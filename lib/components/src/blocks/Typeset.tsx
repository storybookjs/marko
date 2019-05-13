import React from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';

const Label = styled.div(({ theme }) => ({
  marginRight: 30,
  fontSize: `${theme.typography.size.s1}px`,
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
}));

const Sample = styled.div({
  lineHeight: 1,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const TypeSpecimen = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  '&:not(:last-child)': { marginBottom: '1rem' },
});

const Wrapper = styled.div(({ theme }) => ({
  borderRadius: theme.appBorderRadius,
  background: theme.background.content,
  margin: '25px 0 40px',
  boxShadow:
    theme.base === 'light' ? 'rgba(0, 0, 0, 0.10) 0 1px 3px 0' : 'rgba(0, 0, 0, 0.20) 0 2px 5px 0',
  border: `1px solid ${theme.appBorderColor}`,
  padding: '30px 20px',
}));

export interface TypesetProps {
  fontSizes: [number];
  fontWeight?: number;
  sampleText?: string;
}

export const Typeset: React.FunctionComponent<TypesetProps> = ({
  fontSizes,
  fontWeight,
  sampleText,
  ...props
}) => {
  const fontSizesReversed = fontSizes.reverse();
  return (
    <Wrapper {...props}>
      {fontSizesReversed.map(num => (
        <TypeSpecimen key={num}>
          <Label>{num}px</Label>
          <Sample
            style={{
              fontSize: num,
              fontWeight,
            }}
          >
            {sampleText || 'Was he a beast if music could move him so?'}
          </Sample>
        </TypeSpecimen>
      ))}
    </Wrapper>
  );
};
