import React from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
} from '@storybook/addon-docs/blocks';
import { DocgenButton } from '../../components/DocgenButton';
import BaseButton from '../../components/BaseButton';
import { ButtonGroup, SubGroup } from '../../components/ButtonGroup';

export default {
  title: 'Addons/Docs/stories docs blocks',
  component: DocgenButton,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable />
          <Stories />
        </>
      ),
    },
  },
};

export const defDocsPage = () => <div>Default docs page</div>;

export const smallDocsPage = () => <div>Just primary story, </div>;

smallDocsPage.parameters = {
  docs: {
    page: () => (
      <>
        <Title />
        <Primary />
      </>
    ),
  },
};

export const checkBoxProps = () => <div>Primary props displayed with a check box </div>;

checkBoxProps.parameters = {
  docs: {
    page: () => {
      const [showProps, setShowProps] = React.useState(false);
      return (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <label>
            <input type="checkbox" checked={showProps} onChange={() => setShowProps(!showProps)} />
            <span>display props</span>
          </label>
          {showProps && <ArgsTable />}
        </>
      );
    },
  },
};

export const customLabels = () => <div>Display custom title, Subtitle, Description</div>;

customLabels.parameters = {
  docs: {
    page: () => (
      <>
        <Title>Custom title</Title>
        <Subtitle>Custom sub title</Subtitle>
        <Description>Custom description</Description>
        <Primary />
        <ArgsTable />
        <Stories title="Custom stories title" />
      </>
    ),
  },
};

export const customStoriesFilter = () => <div>Displays ALL stories (not excluding first one)</div>;

customStoriesFilter.parameters = {
  docs: {
    page: () => <Stories includePrimary />,
  },
};

export const multipleComponents = () => (
  <ButtonGroup>
    <DocgenButton label="one" />
    <DocgenButton label="two" />
    <DocgenButton label="three" />
  </ButtonGroup>
);

multipleComponents.storyName = 'Many Components';

multipleComponents.parameters = {
  component: ButtonGroup,
  subcomponents: {
    SubGroup,
    'Docgen Button': DocgenButton,
    'Base Button': BaseButton,
  },
  docs: {
    page: () => (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary name="Many Components" />
        <ArgsTable />
      </>
    ),
  },
};

export const componentsProps = () => <div>Display multiple prop tables in tabs</div>;

componentsProps.subcomponents = {
  'Docgen Button': DocgenButton,
  'Base Button': BaseButton,
};

componentsProps.parameters = {
  docs: {
    page: () => (
      <>
        <Title>Multiple prop tables</Title>
        <Description>
          Here's what happens when your component has some related components
        </Description>
        <ArgsTable
          components={{
            'ButtonGroup Custom': ButtonGroup,
            'Docgen Button': DocgenButton,
            'Base Button': BaseButton,
          }}
        />
      </>
    ),
  },
};
