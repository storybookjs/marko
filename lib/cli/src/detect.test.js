import fs from 'fs';

import { getBowerJson, getPackageJson } from './helpers';
import { isStorybookInstalled, detectFrameworkPreset, detect, detectLanguage } from './detect';
import { PROJECT_TYPES, SUPPORTED_FRAMEWORKS, SUPPORTED_LANGUAGES } from './project_types';

jest.mock('./helpers', () => ({
  getBowerJson: jest.fn(),
  getPackageJson: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('path', () => ({
  // make it return just the second path, for easier testing
  join: jest.fn((_, p) => p),
}));

const MOCK_FRAMEWORK_FILES = [
  {
    name: PROJECT_TYPES.METEOR,
    files: {
      '.meteor': 'file content',
    },
  },
  {
    name: PROJECT_TYPES.SFC_VUE,
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
    name: PROJECT_TYPES.VUE,
    files: {
      'package.json': {
        dependencies: {
          vue: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.EMBER,
    files: {
      'package.json': {
        devDependencies: {
          'ember-cli': '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.REACT_PROJECT,
    files: {
      'package.json': {
        peerDependencies: {
          react: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.REACT_NATIVE,
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
    name: PROJECT_TYPES.REACT_SCRIPTS,
    files: {
      'package.json': {
        devDependencies: {
          'react-scripts': '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.WEBPACK_REACT,
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
    name: PROJECT_TYPES.REACT,
    files: {
      'package.json': {
        dependencies: {
          react: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.ANGULAR,
    files: {
      'package.json': {
        dependencies: {
          '@angular/core': '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.WEB_COMPONENTS,
    files: {
      'package.json': {
        dependencies: {
          'lit-element': '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.MITHRIL,
    files: {
      'package.json': {
        dependencies: {
          mithril: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.MARIONETTE,
    files: {
      'package.json': {
        dependencies: {
          'backbone.marionette': '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.MARKO,
    files: {
      'package.json': {
        dependencies: {
          marko: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.RIOT,
    files: {
      'package.json': {
        dependencies: {
          riot: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.PREACT,
    files: {
      'package.json': {
        dependencies: {
          preact: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.SVELTE,
    files: {
      'package.json': {
        dependencies: {
          svelte: '1.0.0',
        },
      },
    },
  },
  {
    name: PROJECT_TYPES.RAX,
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
  it(`should return type HTML if html option is passed`, () => {
    getPackageJson.mockImplementation(() => true);
    expect(detect({ html: true })).toBe(PROJECT_TYPES.HTML);
  });

  it(`should return type UNDETECTED if neither packageJson or bowerJson exist`, () => {
    getPackageJson.mockImplementation(() => false);
    getBowerJson.mockImplementation(() => false);
    expect(detect()).toBe(PROJECT_TYPES.UNDETECTED);
  });

  it(`should return language typescript if the dependency is present`, () => {
    getPackageJson.mockImplementation(() => ({
      dependencies: {
        typescript: '1.0.0',
      },
    }));
    expect(detectLanguage()).toBe(SUPPORTED_LANGUAGES.TYPESCRIPT);
  });

  it(`should return language javascript by default`, () => {
    getPackageJson.mockImplementation(() => true);
    expect(detectLanguage()).toBe(SUPPORTED_LANGUAGES.JAVASCRIPT);
  });

  describe('isStorybookInstalled should return', () => {
    it('false if empty devDependency', () => {
      expect(isStorybookInstalled({ devDependencies: {} }, false)).toBe(false);
    });

    it('false if no devDependency', () => {
      expect(isStorybookInstalled({}, false)).toBe(false);
    });

    SUPPORTED_FRAMEWORKS.forEach((framework) => {
      it(`true if devDependencies has ${framework} Storybook version`, () => {
        const devDependencies = {
          [`@storybook/${framework}`]: '4.0.0-alpha.21',
        };
        expect(isStorybookInstalled({ devDependencies }, false)).toBeTruthy();
      });
    });

    it('false if forced flag', () => {
      expect(
        isStorybookInstalled(
          {
            devDependencies: { '@storybook/react': '4.0.0-alpha.21' },
          },
          true
        )
      ).toBe(false);
    });

    it('ALREADY_HAS_STORYBOOK if lib is present', () => {
      expect(
        isStorybookInstalled({
          devDependencies: { '@storybook/react': '4.0.0-alpha.21' },
        })
      ).toBe(PROJECT_TYPES.ALREADY_HAS_STORYBOOK);
    });

    it('UPDATE_PACKAGE_ORGANIZATIONS if legacy lib is detected', () => {
      expect(
        isStorybookInstalled({
          devDependencies: { '@kadira/storybook': '4.0.0-alpha.21' },
        })
      ).toBe(PROJECT_TYPES.UPDATE_PACKAGE_ORGANIZATIONS);
    });
  });

  describe('detectFrameworkPreset should return', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    MOCK_FRAMEWORK_FILES.forEach((structure) => {
      it(`${structure.name}`, () => {
        fs.existsSync.mockImplementation((filePath) => {
          return Object.keys(structure.files).includes(filePath);
        });

        const result = detectFrameworkPreset(structure.files['package.json']);

        expect(result).toBe(structure.name);
      });
    });

    it(`UNDETECTED for unknown frameworks`, () => {
      const result = detectFrameworkPreset();
      expect(result).toBe(PROJECT_TYPES.UNDETECTED);
    });

    it('REACT_SCRIPTS for custom react scripts config', () => {
      const forkedReactScriptsConfig = {
        '/node_modules/.bin/react-scripts': 'file content',
      };

      fs.existsSync.mockImplementation((filePath) => {
        return Object.keys(forkedReactScriptsConfig).includes(filePath);
      });

      const result = detectFrameworkPreset();
      expect(result).toBe(PROJECT_TYPES.REACT_SCRIPTS);
    });
  });
});
