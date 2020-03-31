#!/usr/bin/env node
/* eslint-disable no-console */

const fetch = require('node-fetch');
const { execSync } = require('child_process');

const { FRONTPAGE_WEBHOOK } = process.env;

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

console.log('build-frontpage');
if (branch === 'master') {
  if (FRONTPAGE_WEBHOOK) {
    console.log('triggering frontpage build');
    const url = `https://api.netlify.com/build_hooks/${FRONTPAGE_WEBHOOK}`;
    fetch(url, { method: 'post' }).then((res) => console.log('result', res.status));
  } else {
    console.log('no webhook defined');
  }
} else {
  console.log('skipping branch', branch);
}
