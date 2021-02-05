import path from 'path';
import findUp from 'find-up';

export const getProjectRoot = () => {
  let result;
  try {
    result = result || path.join(findUp.sync('.git', { type: 'directory' }), '..');
  } catch (e) {
    //
  }
  try {
    result = result || path.join(findUp.sync('.svn', { type: 'directory' }), '..');
  } catch (e) {
    //
  }
  try {
    result = result || __dirname.split('node_modules')[0];
  } catch (e) {
    //
  }

  return result || process.cwd();
};

export const nodeModulesPaths = path.resolve('./node_modules');
export const nodePathsToArray = (nodePath: string) =>
  nodePath
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .map((p) => path.resolve('./', p));
