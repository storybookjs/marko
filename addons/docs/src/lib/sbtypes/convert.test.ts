import 'jest-specific-snapshot';
import { transformSync } from '@babel/core';
import requireFromString from 'require-from-string';
import dedent from 'ts-dedent';

import { convert } from './convert';
import { normalizeNewlines } from '../utils';

expect.addSnapshotSerializer({
  print: (val: any) => JSON.stringify(val, null, 2),
  test: (val) => true,
});

const transformToModule = (inputCode: string) => {
  const options = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            esmodules: true,
          },
        },
      ],
    ],
  };
  const { code } = transformSync(inputCode, options);
  return normalizeNewlines(code);
};

const annotateWithDocgen = (inputCode: string) => {
  const options = {
    presets: ['@babel/typescript', '@babel/react'],
    plugins: ['babel-plugin-react-docgen', '@babel/plugin-proposal-class-properties'],
    babelrc: false,
    filename: 'temp.tsx',
  };
  const { code } = transformSync(inputCode, options);
  return normalizeNewlines(code);
};

const convertTs = (propsInterface: string) => {
  const code = dedent`
    import React, { FC } from 'react';
    ${propsInterface}
    export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
  `;
  const docgenPretty = annotateWithDocgen(code);
  const { Component } = requireFromString(transformToModule(docgenPretty));
  // eslint-disable-next-line no-underscore-dangle
  const { props = {} } = Component.__docgenInfo || {};
  const types = Object.keys(props).reduce((acc: Record<string, any>, key) => {
    acc[key] = convert(props[key]);
    return acc;
  }, {});
  return types;
};

describe('storybook type system', () => {
  describe('typescript', () => {
    it('scalars', () => {
      expect(
        convertTs(dedent`
          interface Props {
            any: any;
            string: string;
            bool: boolean;
            number: number;
            symbol: symbol;
            readonly readonlyPrimitive: string;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "any": {
            "name": "other",
            "value": "any"
          },
          "string": {
            "name": "string"
          },
          "bool": {
            "name": "boolean"
          },
          "number": {
            "name": "number"
          },
          "symbol": {
            "name": "symbol"
          },
          "readonlyPrimitive": {
            "name": "string"
          }
        }
      `);
    });
    it('functions', () => {
      expect(
        convertTs(dedent`
          interface Props {
            onClick?: () => void;
            voidFunc: () => void;
            funcWithArgsAndReturns: (a: string, b: string) => string;
            funcWithUnionArg: (a: string | number) => string;
            funcWithMultipleUnionReturns: () => string | ItemInterface;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "onClick": {
            "raw": "() => void",
            "name": "function"
          },
          "voidFunc": {
            "raw": "() => void",
            "name": "function"
          },
          "funcWithArgsAndReturns": {
            "raw": "(a: string, b: string) => string",
            "name": "function"
          },
          "funcWithUnionArg": {
            "raw": "(a: string | number) => string",
            "name": "function"
          },
          "funcWithMultipleUnionReturns": {
            "raw": "() => string | ItemInterface",
            "name": "function"
          }
        }
      `);
    });
    it('enums', () => {
      expect(
        convertTs(dedent`
          enum DefaultEnum {
            TopLeft,
            TopRight,
            TopCenter,
          }
          enum NumericEnum {
            TopLeft = 0,
            TopRight,
            TopCenter,
          }
          enum StringEnum {
            TopLeft = 'top-left',
            TopRight = 'top-right',
            TopCenter = 'top-center',
          }
          interface Props {
            defaultEnum: DefaultEnum;
            numericEnum: NumericEnum;
            stringEnum: StringEnum;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "defaultEnum": {
            "name": "other",
            "value": "DefaultEnum"
          },
          "numericEnum": {
            "name": "other",
            "value": "NumericEnum"
          },
          "stringEnum": {
            "name": "other",
            "value": "StringEnum"
          }
        }
      `);
    });
    it('unions', () => {
      expect(
        convertTs(dedent`
          type Kind = 'default' | 'action';
          enum DefaultEnum {
            TopLeft,
            TopRight,
            TopCenter,
          }            
          enum NumericEnum {
            TopLeft = 0,
            TopRight,
            TopCenter,
          }
          type EnumUnion = DefaultEnum | NumericEnum;
          interface Props {
            kind?: Kind;
            inlinedNumericLiteralUnion: 0 | 1;
            enumUnion: EnumUnion;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "kind": {
            "raw": "'default' | 'action'",
            "name": "union",
            "value": [
              {
                "name": "other",
                "value": "literal"
              },
              {
                "name": "other",
                "value": "literal"
              }
            ]
          },
          "inlinedNumericLiteralUnion": {
            "raw": "0 | 1",
            "name": "union",
            "value": [
              {
                "name": "other",
                "value": "literal"
              },
              {
                "name": "other",
                "value": "literal"
              }
            ]
          },
          "enumUnion": {
            "raw": "DefaultEnum | NumericEnum",
            "name": "union",
            "value": [
              {
                "name": "other",
                "value": "DefaultEnum"
              },
              {
                "name": "other",
                "value": "NumericEnum"
              }
            ]
          }
        }
      `);
    });
    it('intersections', () => {
      expect(
        convertTs(dedent`
          interface ItemInterface {
            text: string;
            value: string;
          }
          interface PersonInterface {
            name: string;
          }
          type InterfaceIntersection = ItemInterface & PersonInterface;
          interface Props {
            intersectionType: InterfaceIntersection;
            intersectionWithInlineType: ItemInterface & { inlineValue: string };
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "intersectionType": {
            "raw": "ItemInterface & PersonInterface",
            "name": "intersection",
            "value": [
              {
                "name": "other",
                "value": "ItemInterface"
              },
              {
                "name": "other",
                "value": "PersonInterface"
              }
            ]
          },
          "intersectionWithInlineType": {
            "raw": "ItemInterface & { inlineValue: string }",
            "name": "intersection",
            "value": [
              {
                "name": "other",
                "value": "ItemInterface"
              },
              {
                "raw": "{ inlineValue: string }",
                "name": "object",
                "value": {
                  "inlineValue": {
                    "name": "string"
                  }
                }
              }
            ]
          }
        }
      `);
    });
    it('arrays', () => {
      expect(
        convertTs(dedent`
          interface ItemInterface {
            text: string;
            value: string;
          }
          interface Point {
            x: number;
            y: number;
          }
          interface Props {
            arrayOfPoints: Point[];
            arrayOfInlineObjects: { w: number; h: number }[];
            arrayOfPrimitive: string[];
            arrayOfComplexObject: ItemInterface[];
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "arrayOfPoints": {
            "raw": "Point[]",
            "name": "array",
            "value": [
              {
                "name": "other",
                "value": "Point"
              }
            ]
          },
          "arrayOfInlineObjects": {
            "raw": "{ w: number; h: number }[]",
            "name": "array",
            "value": [
              {
                "raw": "{ w: number; h: number }",
                "name": "object",
                "value": {
                  "w": {
                    "name": "number"
                  },
                  "h": {
                    "name": "number"
                  }
                }
              }
            ]
          },
          "arrayOfPrimitive": {
            "raw": "string[]",
            "name": "array",
            "value": [
              {
                "name": "string"
              }
            ]
          },
          "arrayOfComplexObject": {
            "raw": "ItemInterface[]",
            "name": "array",
            "value": [
              {
                "name": "other",
                "value": "ItemInterface"
              }
            ]
          }
        }
      `);
    });
    it('interfaces', () => {
      expect(
        convertTs(dedent`
          interface ItemInterface {
            text: string;
            value: string;
          }
          interface GenericInterface<T> {
            value: T;
          }
          interface Props {
            interface: ItemInterface;
            genericInterface: GenericInterface<string>;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "interface": {
            "name": "other",
            "value": "ItemInterface"
          },
          "genericInterface": {
            "raw": "GenericInterface<string>",
            "name": "other",
            "value": "GenericInterface"
          }
        }
      `);
    });
    it('records', () => {
      expect(
        convertTs(dedent`
          interface ItemInterface {
            text: string;
            value: string;
          }
          interface Props {
            recordOfPrimitive: Record<string, number>;
            recordOfComplexObject: Record<string, ItemInterface>;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "recordOfPrimitive": {
            "raw": "Record<string, number>",
            "name": "other",
            "value": "Record"
          },
          "recordOfComplexObject": {
            "raw": "Record<string, ItemInterface>",
            "name": "other",
            "value": "Record"
          }
        }
      `);
    });
    it('aliases', () => {
      expect(
        convertTs(dedent`
          type StringAlias = string;
          type NumberAlias = number;
          type AliasesIntersection = StringAlias & NumberAlias;
          type AliasesUnion = StringAlias | NumberAlias;
          type GenericAlias<T> = { value: T };
          interface Props {
            typeAlias: StringAlias;
            aliasesIntersection: AliasesIntersection;
            aliasesUnion: AliasesUnion;
            genericAlias: GenericAlias<string>;
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "typeAlias": {
            "name": "string"
          },
          "aliasesIntersection": {
            "raw": "StringAlias & NumberAlias",
            "name": "intersection",
            "value": [
              {
                "name": "string"
              },
              {
                "name": "number"
              }
            ]
          },
          "aliasesUnion": {
            "raw": "StringAlias | NumberAlias",
            "name": "union",
            "value": [
              {
                "name": "string"
              },
              {
                "name": "number"
              }
            ]
          },
          "genericAlias": {
            "raw": "{ value: T }",
            "name": "object",
            "value": {
              "value": {
                "name": "string"
              }
            }
          }
        }
      `);
    });
    it('tuples', () => {
      expect(
        convertTs(dedent`
          interface ItemInterface {
            text: string;
            value: string;
          }
          interface Props {
            tupleOfPrimitive: [string, number];
            tupleWithComplexType: [string, ItemInterface];
          }
        `)
      ).toMatchInlineSnapshot(`
        {
          "tupleOfPrimitive": {
            "raw": "[string, number]",
            "name": "other",
            "value": "tuple"
          },
          "tupleWithComplexType": {
            "raw": "[string, ItemInterface]",
            "name": "other",
            "value": "tuple"
          }
        }
      `);
    });
  });
});
