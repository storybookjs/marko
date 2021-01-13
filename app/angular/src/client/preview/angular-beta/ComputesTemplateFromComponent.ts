import { Type } from '@angular/core';
import { ICollection } from '../types';
import {
  ComponentInputsOutputs,
  getComponentDecoratorMetadata,
  getComponentInputsOutputs,
} from './utils/NgComponentAnalyzer';

const separateInputsOutputsAttributes = (
  ngComponentInputsOutputs: ComponentInputsOutputs,
  props: ICollection = {}
) => {
  const inputs = ngComponentInputsOutputs.inputs
    .filter((i) => i.templateName in props)
    .map((i) => i.templateName);
  const outputs = ngComponentInputsOutputs.outputs
    .filter((o) => o.templateName in props)
    .map((o) => o.templateName);

  return {
    inputs,
    outputs,
    otherProps: Object.keys(props).filter((k) => ![...inputs, ...outputs].includes(k)),
  };
};

/**
 * Converted a component into a template with inputs/outputs present in initial props
 * @param component
 * @param initialProps
 * @param innerTemplate
 */
export const computesTemplateFromComponent = (
  component: Type<unknown>,
  initialProps?: ICollection,
  innerTemplate = ''
) => {
  const ngComponentMetadata = getComponentDecoratorMetadata(component);
  const ngComponentInputsOutputs = getComponentInputsOutputs(component);

  const { inputs: initialInputs, outputs: initialOutputs } = separateInputsOutputsAttributes(
    ngComponentInputsOutputs,
    initialProps
  );

  const templateInputs =
    initialInputs.length > 0 ? ` ${initialInputs.map((i) => `[${i}]="${i}"`).join(' ')}` : '';
  const templateOutputs =
    initialOutputs.length > 0
      ? ` ${initialOutputs.map((i) => `(${i})="${i}($event)"`).join(' ')}`
      : '';

  return `<${ngComponentMetadata.selector}${templateInputs}${templateOutputs}>${innerTemplate}</${ngComponentMetadata.selector}>`;
};
