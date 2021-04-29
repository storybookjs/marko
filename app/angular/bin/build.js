#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('../dist/ts3.9/server/build');
