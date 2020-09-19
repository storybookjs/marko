const os = require('os');

/**
 * The maximum number of concurrent tasks we want to have on some CLI and CI tasks.
 * The amount of CPUS minus one.
 * @type {number}
 */
const maxConcurrentTasks = Math.max(1, os.cpus().length - 1);

module.exports = {
  maxConcurrentTasks,
};
