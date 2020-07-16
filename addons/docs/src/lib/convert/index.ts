import { DocgenInfo } from '../docgen/types';
import { convert as tsConvert, TSType } from './typescript';
import { convert as propTypesConvert } from './proptypes';

export const convert = (docgenInfo: DocgenInfo) => {
  const { type, tsType } = docgenInfo;
  if (type != null) return propTypesConvert(type);
  if (tsType != null) return tsConvert(tsType as TSType);

  return null;
};
