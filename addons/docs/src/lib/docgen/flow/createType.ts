import { PropType } from '@storybook/components';
import { DocgenFlowType } from '../types';
import { createSummaryValue, isTooLongForTypeSummary } from '../../utils';

enum FlowTypesType {
  UNION = 'union',
  SIGNATURE = 'signature',
}

interface DocgenFlowUnionType extends DocgenFlowType {
  elements: { name: string; value: string }[];
}

function generateUnion({ name, raw, elements }: DocgenFlowUnionType): PropType {
  if (raw != null) {
    return createSummaryValue(raw);
  }

  if (elements != null) {
    return createSummaryValue(elements.map(x => x.value).join(' | '));
  }

  return createSummaryValue(name);
}

function generateFuncSignature({ type, raw }: DocgenFlowType): PropType {
  if (raw != null) {
    return createSummaryValue(raw);
  }

  return createSummaryValue(type);
}

function generateObjectSignature({ type, raw }: DocgenFlowType): PropType {
  if (raw != null) {
    return !isTooLongForTypeSummary(raw) ? createSummaryValue(raw) : createSummaryValue(type, raw);
  }

  return createSummaryValue(type);
}

function generateSignature(flowType: DocgenFlowType): PropType {
  const { type } = flowType;

  return type === 'object' ? generateObjectSignature(flowType) : generateFuncSignature(flowType);
}

function generateDefault({ name, raw }: DocgenFlowType): PropType {
  if (raw != null) {
    return !isTooLongForTypeSummary(raw) ? createSummaryValue(raw) : createSummaryValue(name, raw);
  }

  return createSummaryValue(name);
}

export function createType(type: DocgenFlowType): PropType {
  // A type could be null if a defaultProp has been provided without a type definition.
  if (type == null) {
    return null;
  }

  switch (type.name) {
    case FlowTypesType.UNION:
      return generateUnion(type as DocgenFlowUnionType);
    case FlowTypesType.SIGNATURE:
      return generateSignature(type);
    default:
      return generateDefault(type);
  }
}
