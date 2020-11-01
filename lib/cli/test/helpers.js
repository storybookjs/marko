const { sync: spawnSync } = require('cross-spawn');
const path = require('path');

const CLI_PATH = path.join(__dirname, '..', 'bin');

/**
 * Execute command
 * @param {String[]} args - args to be passed in
 * @param {Boolean} [cli=true] - invoke the binary
 * @returns {Object}
 */
const run = (args, options = {}, cli = true) =>
  spawnSync(cli ? 'node' : args[0], cli ? [CLI_PATH].concat(args) : args.slice(1), options);

module.exports = run;
