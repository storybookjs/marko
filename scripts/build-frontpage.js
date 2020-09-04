#!/usr/bin/env node
/* eslint-disable no-console */

const fetch = require('node-fetch');
const { execSync } = require('child_process');

const { FRONTPAGE_WEBHOOK, FRONTPAGE_WEBHOOK_NEXT } = process.env;

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const branchToHook = {
  master: FRONTPAGE_WEBHOOK,
  next: FRONTPAGE_WEBHOOK_NEXT,
};

console.log('build-frontpage');
const hook = branchToHook[branch];
if (hook) {
  console.log('triggering frontpage build');
  const url = `https://api.netlify.com/build_hooks/${hook}`;
  fetch(url, { method: 'post' }).then((res) => console.log('result', res.status));
} else {
  console.log('skipping branch', branch);
}
