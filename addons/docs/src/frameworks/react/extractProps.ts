import PropTypes from 'prop-types';
import {
  PropDef,
  hasDocgen,
  extractComponentProps,
  PropsExtractor,
  TypeSystem,
} from '../../lib/docgen';
import { Component } from '../../blocks/types';
import { enhancePropTypesProps } from './propTypes/handleProp';
import { enhanceTypeScriptProps } from './typeScript/handleProp';
import { isMemo, isForwardRef } from './lib';

export interface PropDefMap {
  [p: string]: PropDef;
}

const propTypesMap = new Map();

Object.keys(PropTypes).forEach((typeName) => {
  // @ts-ignore
  const type = PropTypes[typeName];

  propTypesMap.set(type, typeName);
  propTypesMap.set(type.isRequired, typeName);
});

function getPropDefs(component: Component, section: string): PropDef[] {
  // destructure here so we don't get silly TS errors 🙄
  // eslint-disable-next-line react/forbid-foreign-prop-types
  const { render, type, propTypes } = component;
  let processedComponent = component;

  if ((!hasDocgen(component) || !propTypes) && (isMemo(component) || isForwardRef(component))) {
    processedComponent = isForwardRef(component) ? render : type;
  }

  const extractedProps = extractComponentProps(processedComponent, section);
  if (extractedProps.length === 0) {
    return [];
  }

  switch (extractedProps[0].typeSystem) {
    case TypeSystem.JAVASCRIPT:
      return enhancePropTypesProps(extractedProps, component);
    case TypeSystem.TYPESCRIPT:
      return enhanceTypeScriptProps(extractedProps);
    default:
      return extractedProps.map((x) => x.propDef);
  }
}

export const extractProps: PropsExtractor = (component) => ({
  rows: getPropDefs(component, 'props'),
});
