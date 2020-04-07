import 'jest-specific-snapshot';
import path from 'path';
import glob from 'glob';

import { transformFileSync, transformSync } from '@babel/core';
import requireFromString from 'require-from-string';

import { convert } from './convert';
import { normalizeNewlines } from '../utils';

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

const annotateWithDocgen = (inputPath: string) => {
  const options = {
    presets: ['@babel/typescript', '@babel/react'],
    plugins: ['babel-plugin-react-docgen', '@babel/plugin-proposal-class-properties'],
    babelrc: false,
  };
  const { code } = transformFileSync(inputPath, options);
  return normalizeNewlines(code);
};

describe('storybook type system', () => {
  describe('proptypes', () => {
    glob
      .sync(path.join(__dirname, '__testfixtures__/typescript/all/input.*'))
      .forEach((inputPath) => {
        const testDir = path.dirname(inputPath);
        it(path.basename(testDir), () => {
          const snapDir = path.join(testDir, 'snaps');
          const docgenPretty = annotateWithDocgen(inputPath);
          expect(docgenPretty).toMatchSpecificSnapshot(path.join(snapDir, `docgen.snap`));

          const { Component } = requireFromString(transformToModule(docgenPretty));

          // eslint-disable-next-line no-underscore-dangle
          const { props = {} } = Component.__docgenInfo || {};
          const types = Object.keys(props).reduce((acc: Record<string, any>, key) => {
            acc[key] = convert(props[key]);
            return acc;
          }, {});
          //        expect(JSON.stringify(types, null, 2)).toMatchSpecificSnapshot(
          expect(types).toMatchSpecificSnapshot(path.join(snapDir, 'types.snap'));
        });
      });
  });
});
