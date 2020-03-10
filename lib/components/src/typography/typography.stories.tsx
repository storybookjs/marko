import React from 'react';
import { styled } from '@storybook/theming';
import { storiesOf } from '@storybook/react';

const Info = styled.div({
  marginBottom: '3rem',
});

const Heading1 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.l3,
}));
const Heading2 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.l2,
}));
const Heading3 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.l1,
}));
const Heading4 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.m3,
}));
const Heading5 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.m3,
}));
const Heading6 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.m1,
}));
const Heading7 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s3,
}));
const Heading8 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
}));
const Heading9 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s1,
}));

const HeadingWrapper = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.black,
  '> *': {
    marginBottom: '1rem',
  },
}));

const Type1 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s3,
}));
const Type2 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
}));
const Type3 = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s1,
}));

const TypeWrapper = styled.div({
  '> *': {
    marginBottom: '1rem',
  },
});

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  '> *': {
    flex: 1,
    paddingRight: 40,
  },
});

const Page = styled.div({
  padding: '3rem',
});

storiesOf('Basics/typography', module).add('all', () => (
  <Page>
    <Info>
      <div>
        <b>Font-family:</b> "Nunito sans", Apple system font ... sans-serif
      </div>
      <div>
        <b>UI text size:</b> 13px
      </div>
      <div>
        <b>Document/Markdown text size:</b> 14px
      </div>
      <div>
        <b>Code font:</b> <code>Operator Mono, Fira Code, Consolas ... monospace</code>
      </div>
      <div>
        <b>Weights:</b> 400(normal), 600(bold), 900(black)
      </div>
    </Info>
    <Wrapper>
      <HeadingWrapper>
        <Heading1>48 heading</Heading1>
        <Heading2>40 heading</Heading2>
        <Heading3>32 heading</Heading3>
        <Heading4>28 heading</Heading4>
        <Heading5>24 heading</Heading5>
        <Heading6>20 heading</Heading6>
        <Heading7>16 heading</Heading7>
        <Heading8>14 heading</Heading8>
        <Heading9>12 heading</Heading9>
      </HeadingWrapper>
      <TypeWrapper>
        <Type1>16 The quick brown fox jumps over the lazy dog</Type1>
        <Type2>14 The quick brown fox jumps over the lazy dog</Type2>
        <Type3>12 The quick brown fox jumps over the lazy dog</Type3>
      </TypeWrapper>
    </Wrapper>
  </Page>
));
