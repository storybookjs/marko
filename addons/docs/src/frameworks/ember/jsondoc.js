/* eslint-disable no-underscore-dangle */
/* global window */

export const setJSONDoc = (jsondoc) => {
  window.__EMBER_GENERATED_DOC_JSON__ = jsondoc;
};
export const getJSONDoc = () => {
  return window.__EMBER_GENERATED_DOC_JSON__;
};

export const extractArgTypes = (componentName) => {
  const json = getJSONDoc();
  const componentDoc = json.included.find((doc) => doc.attributes.name === componentName);
  const rows = componentDoc.attributes.arguments.map((prop) => {
    return {
      name: prop.name,
      defaultValue: prop.defaultValue,
      description: prop.description,
      table: {
        type: {
          summary: prop.type,
          required: prop.tags.length ? prop.tags.some((tag) => tag.name === 'required') : false,
        },
      },
    };
  });
  return { rows };
};

export const extractComponentDescription = (componentName) => {
  const json = getJSONDoc();
  const componentDoc = json.included.find((doc) => doc.attributes.name === componentName);

  if (!componentDoc) {
    return '';
  }

  return componentDoc.attributes.description;
};
