import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { workspaces } from '@angular-devkit/core';

/**
 * Returns the workspace definition
 *
 * - Either from NX if it is present
 * - Either from `@angular-devkit/core` -> https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/core
 */
export const readAngularWorkspaceConfig = async (
  dirToSearch: string
): Promise<workspaces.WorkspaceDefinition> => {
  const host = workspaces.createWorkspaceHost(new NodeJsSyncHost());

  try {
    /**
     * Apologies for the following line
     * If there's a better way to do it, let's do it
     */
    /* eslint-disable global-require */

    // catch if nx.json does not exist
    require('@nrwl/workspace').readNxJson();

    const nxWorkspace = require('@nrwl/workspace').readWorkspaceConfig({
      format: 'angularCli',
    });

    // Use the workspace version of nx when angular looks for the angular.json file
    host.readFile = (path) => {
      if (typeof path === 'string' && path.endsWith('angular.json')) {
        return Promise.resolve(JSON.stringify(nxWorkspace));
      }
      return host.readFile(path);
    };
  } catch (e) {
    // Ignore if the client does not use NX
  }

  return (await workspaces.readWorkspace(dirToSearch, host)).workspace;
};

export const getProjectName = (workspace: workspaces.WorkspaceDefinition): string => {
  const environmentProjectName = process.env.STORYBOOK_ANGULAR_PROJECT;
  if (environmentProjectName) {
    return environmentProjectName;
  }

  if (workspace.projects.has('storybook')) {
    return 'storybook';
  }
  if (workspace.extensions.defaultProject) {
    return workspace.extensions.defaultProject as string;
  }

  const firstProjectName = workspace.projects.keys().next().value;
  if (firstProjectName) {
    return firstProjectName;
  }
  throw new Error('No angular projects found.');
};

export const findAngularProject = (
  workspace: workspaces.WorkspaceDefinition
): {
  projectName: string;
  project: workspaces.ProjectDefinition;
} => {
  if (!workspace.projects || !Object.keys(workspace.projects).length) {
    throw new Error('No angular projects found.');
  }

  const projectName = getProjectName(workspace);

  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new Error(`Could not find angular project '${projectName}' in angular.json.`);
  }
  return { projectName, project };
};
