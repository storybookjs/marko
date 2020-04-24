import fs from 'fs';
import path from 'path';

import { getBowerJson, getPackageJson } from './helpers';
import { isStorybookInstalled, detectFramework, detect } from './detect';
import projectTypes, { supportedFrameworks } from './project_types';

jest.mock('./helpers', () => ({
  getBowerJson: jest.fn(),
  getPackageJson: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

const MOCK_FRAMEWORK_FILES = [
  {
    name: projectTypes.METEOR,
    files: {
      [path.join(process.cwd(), '.meteor')]: 'file content',
    },
  },
  {
    name: projectTypes.SFC_VUE,
    files: {
      'package.json': {
        dependencies: {
          vuetify: '1.0.0',
        },
        devDependencies: {
          'vue-loader': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.VUE,
    files: {
      'package.json': {
        dependencies: {
          vue: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.EMBER,
    files: {
      'package.json': {
        devDependencies: {
          'ember-cli': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.REACT_PROJECT,
    files: {
      'package.json': {
        peerDependencies: {
          react: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.REACT_NATIVE,
    files: {
      'package.json': {
        dependencies: {
          'react-native': '1.0.0',
        },
        devDependencies: {
          'react-native-scripts': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.REACT_SCRIPTS,
    files: {
      'package.json': {
        devDependencies: {
          'react-scripts': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.WEBPACK_REACT,
    files: {
      'package.json': {
        dependencies: {
          react: '1.0.0',
        },
        devDependencies: {
          webpack: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.REACT,
    files: {
      'package.json': {
        dependencies: {
          react: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.ANGULAR,
    files: {
      'package.json': {
        dependencies: {
          '@angular/core': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.WEB_COMPONENTS,
    files: {
      'package.json': {
        dependencies: {
          'lit-element': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.MITHRIL,
    files: {
      'package.json': {
        dependencies: {
          mithril: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.MARIONETTE,
    files: {
      'package.json': {
        dependencies: {
          'backbone.marionette': '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.MARKO,
    files: {
      'package.json': {
        dependencies: {
          marko: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.RIOT,
    files: {
      'package.json': {
        dependencies: {
          riot: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.PREACT,
    files: {
      'package.json': {
        dependencies: {
          preact: '1.0.0',
        },
      },
    },
  },
  {
    name: projectTypes.RAX,
    files: {
      '.rax': 'file content',
      'package.json': {
        dependencies: {
          rax: '1.0.0',
        },
      },
    },
  },
];

describe('Detect', () => {
  it(`should return ${projectTypes.HTML} if html option is passed`, () => {
    expect(detect({ html: true })).toBe(projectTypes.HTML);
  });

  it(`should return ${projectTypes.UNDETECTED} if neither packageJson or bowerJson exist`, () => {
    getPackageJson.mockImplementation(() => false);
    getBowerJson.mockImplementation(() => false);
    expect(detect()).toBe(projectTypes.UNDETECTED);
  });

  describe('isStorybookInstalled should return', () => {
    it('false if empty devDependency', () => {
      expect(isStorybookInstalled({ devDependencies: {} }, false)).toBe(false);
    });

    it('false if no devDependency', () => {
      expect(isStorybookInstalled({}, false)).toBe(false);
    });

    supportedFrameworks.forEach((framework) => {
      it(`true if devDependencies has ${framework} Storybook version`, () => {
        const devDependencies = {
          [`@storybook/${framework}`]: '4.0.0-alpha.21',
        };
        expect(isStorybookInstalled({ devDependencies }, false)).toBeTruthy();
      });
    });

    it('true if forced flag', () => {
      expect(
        isStorybookInstalled({
          devDependencies: { 'storybook/react': '4.0.0-alpha.21' },
        })
      ).toBe(false);
    });
  });

  describe('detectFramework', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    MOCK_FRAMEWORK_FILES.forEach((structure) => {
      it(`should detect ${structure.name}`, () => {
        fs.existsSync.mockImplementation((filePath) => {
          return Object.keys(structure.files).includes(filePath);
        });

        const result = detectFramework(structure.files['package.json']);

        expect(result).toBe(structure.name);
      });
    });

    it(`should return ${projectTypes.UNDETECTED} for unknown frameworks`, () => {
      const result = detectFramework();
      expect(result).toBe(projectTypes.UNDETECTED);
    });

    it('should detect custom REACT_SCRIPTS', () => {
      const forkedReactScriptsConfig = {
        [path.join(process.cwd(), '/node_modules/.bin/react-scripts')]: 'file content',
      };

      fs.existsSync.mockImplementation((filePath) => {
        return Object.keys(forkedReactScriptsConfig).includes(filePath);
      });

      const result = detectFramework();
      expect(result).toBe(projectTypes.REACT_SCRIPTS);
    });
  });
});
