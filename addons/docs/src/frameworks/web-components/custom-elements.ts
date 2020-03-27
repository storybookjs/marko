/* eslint-disable import/no-extraneous-dependencies */
import { getCustomElements, isValidComponent, isValidMetaData } from '@storybook/web-components';

interface TagItem {
  name: string;
  type: string;
  description: string;
  default?: any;
  defaultValue?: any;
}

interface Tag {
  name: string;
  description: string;
  attributes?: TagItem[];
  properties?: TagItem[];
  events?: TagItem[];
  slots?: TagItem[];
  cssProperties?: TagItem[];
}

interface CustomElements {
  tags: Tag[];
}

interface Sections {
  attributes?: any;
  properties?: any;
  events?: any;
  slots?: any;
  css?: any;
}

function mapData(data: TagItem[]) {
  return data.map((item) => ({
    name: item.name,
    type: { summary: item.type },
    required: '',
    description: item.description,
    defaultValue: { summary: item.default !== undefined ? item.default : item.defaultValue },
  }));
}

function isEmpty(obj: object) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

export const extractPropsFromElements = (tagName: string, customElements: CustomElements) => {
  if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
    return null;
  }
  const metaData = customElements.tags.find(
    (tag) => tag.name.toUpperCase() === tagName.toUpperCase()
  );
  const sections: Sections = {};
  if (metaData.attributes) {
    sections.attributes = mapData(metaData.attributes);
  }
  if (metaData.properties) {
    sections.properties = mapData(metaData.properties);
  }
  if (metaData.events) {
    sections.events = mapData(metaData.events);
  }
  if (metaData.slots) {
    sections.slots = mapData(metaData.slots);
  }
  if (metaData.cssProperties) {
    sections.css = mapData(metaData.cssProperties);
  }
  return isEmpty(sections) ? false : { sections };
};

export const extractProps = (tagName: string) => {
  const customElements: CustomElements = getCustomElements();
  return extractPropsFromElements(tagName, customElements);
};

export const extractComponentDescription = (tagName: string) => {
  const customElements: CustomElements = getCustomElements();
  if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
    return null;
  }
  const metaData = customElements.tags.find(
    (tag) => tag.name.toUpperCase() === tagName.toUpperCase()
  );
  return metaData && metaData.description;
};
