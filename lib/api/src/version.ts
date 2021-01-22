/* eslint-disable import/no-extraneous-dependencies */
// @ts-ignore
import preval from 'preval.macro';

export const version = preval`
  const fs = require('fs-extra');
  const path = require('path');
  const { version } = require(path.join(__dirname, '..', 'package.json'));

  module.exports = version;
` as string;
