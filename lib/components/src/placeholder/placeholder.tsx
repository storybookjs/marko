import React, { Children, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

const Title = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
}));

const Desc = styled.div();

const Message = styled.div(({ theme }) => ({
  padding: 30,
  textAlign: 'center',
  color: theme.color.defaultText,
  fontSize: theme.typography.size.s2 - 1,
}));

export const Placeholder: FunctionComponent = ({ children, ...props }) => {
  const [title, desc] = Children.toArray(children);
  return (
    <Message {...props}>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
    </Message>
  );
};
