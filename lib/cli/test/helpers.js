const { sync: spawnSync } = require('cross-spawn');
const fs = require('fs');
const path = require('path');

const CLI_PATH = path.join(__dirname, '..', 'bin');

/**
 * Copy files
 * @param {String} source - source directory path
 * @param {String} target - path to the destination directory
 * @returns {Void}
 */
const copyFileSync = (source, target) => {
  let targetFile = target;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

/**
 * Copy directory content recursively
 * @param {String} source - source directory path
 * @param {String} target - path to the destination directory
 * @returns {Void}
 */
const copyDirSync = (source, target) => {
  // check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    fs.readdirSync(source).forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyDirSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
};

/**
 * Execute command
 * @param {String[]} args - args to be passed in
 * @param {Boolean} [cli=true] - invoke the binary
 * @returns {Object}
 */
const run = (args, options = {}, cli = true) => spawnSync(cli ? 'node' : args[0], cli ? [CLI_PATH].concat(args) : args.slice(1), options);

module.exports = {
  copyDirSync,
  run
};
