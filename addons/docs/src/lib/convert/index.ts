import { DocgenInfo } from '../docgen/types';
import { convert as tsConvert, TSType } from './typescript';
import { convert as flowConvert, FlowType } from './flow';
import { convert as propTypesConvert } from './proptypes';

export const convert = (docgenInfo: DocgenInfo) => {
  const { type, tsType, flowType } = docgenInfo;
  if (type != null) return propTypesConvert(type);
  if (tsType != null) return tsConvert(tsType as TSType);
  if (flowType != null) return flowConvert(flowType as FlowType);

  return null;
};
