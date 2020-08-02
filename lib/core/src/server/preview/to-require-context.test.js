import path from 'path';
import { toRequireContext } from './to-require-context';

const testCases = [
  {
    glob: '**/*.stories.tsx',
    recursive: true,
    validPaths: [
      './Icon.stories.tsx',
      './src/Icon.stories.tsx',
      './src/components/Icon.stories.tsx',
      './src/components/Icon.stories/Icon.stories.tsx',
    ],
    invalidPaths: [
      './stories.tsx',
      './Icon.stories.ts',
      './Icon.stories.js',
      './src/components/stories.tsx',
      './src/components/Icon.stories/stories.tsx',
      './src/components/Icon.stories.ts',
      './src/components/Icon.stories.js',
    ],
  },
  // INVALID GLOB
  {
    glob: '../src/stories/**/*.stories.(js|mdx)',
    recursive: true,
    validPaths: [
      '../src/stories/components/Icon.stories.js',
      '../src/stories/Icon.stories.js',
      '../src/stories/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.js',
      '../src/stories/components/Icon.stories/Icon.stories.mdx',
    ],
    invalidPaths: [
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
  {
    glob: 'dirname/../stories/*.stories.*',
    recursive: false,
    validPaths: [
      './dirname/../stories/App.stories.js',
      './dirname/../stories/addon-centered.stories.js',
    ],
    invalidPaths: ['./dirname/../stories.js', './dirname/../App.stories.js'],
  },
  {
    glob: '../src/stories/**/@(*.stories.js|*.stories.mdx)',
    recursive: true,
    validPaths: [
      '../src/stories/components/Icon.stories.js',
      '../src/stories/Icon.stories.js',
      '../src/stories/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.js',
      '../src/stories/components/Icon.stories/Icon.stories.mdx',
    ],
    invalidPaths: [
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
  {
    glob: '../src/stories/**/*.stories.+(js|mdx)',
    recursive: true,
    validPaths: [
      '../src/stories/components/Icon.stories.js',
      '../src/stories/Icon.stories.js',
      '../src/stories/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.js',
      '../src/stories/components/Icon.stories/Icon.stories.mdx',
    ],
    invalidPaths: [
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
  {
    glob: '../src/stories/**/*.stories.*(js|mdx)',
    recursive: true,
    validPaths: [
      '../src/stories/components/Icon.stories.js',
      '../src/stories/Icon.stories.js',
      '../src/stories/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.js',
      '../src/stories/components/Icon.stories/Icon.stories.mdx',
    ],
    invalidPaths: [
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
  // DUMB GLOB
  {
    glob: '../src/stories/**/*.stories.[tj]sx',
    recursive: true,
    validPaths: [
      '../src/stories/components/Icon.stories.jsx',
      '../src/stories/Icon.stories.jsx',
      '../src/stories/Icon.stories.tsx',
      '../src/stories/components/Icon/Icon.stories.jsx',
      '../src/stories/components/Icon.stories/Icon.stories.tsx',
    ],
    invalidPaths: [
      './stories.jsx',
      './src/stories/Icon.stories.jsx',
      './Icon.stories.jsx',
      '../src/Icon.stories.tsx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.tsx',
    ],
  },
  {
    glob: '../components/*.stories.js',
    recursive: false,
    validPaths: ['../components/Icon.stories.js'],
    invalidPaths: [
      '../components/icon/node_modules/icon/Icon.stories.js',
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
  {
    glob: '../components/*/*.stories.js',
    recursive: true,
    validPaths: ['../components/icon/Icon.stories.js'],
    invalidPaths: [
      '../components/icon/node_modules/icon/Icon.stories.js',
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
  {
    glob: '../components/*/stories/*.js',
    recursive: true,
    validPaths: ['../components/icon/stories/Icon.js'],
    invalidPaths: [
      '../components/icon/node_modules/icon/stories/Icon.js',
      './stories.js',
      './src/stories/Icon.stories.js',
      './Icon.stories.js',
      '../src/Icon.stories.mdx',
      '../src/stories/components/Icon/Icon.stories.ts',
      '../src/stories/components/Icon/Icon.mdx',
    ],
  },
];

describe('toRequireContext', () => {
  testCases.forEach(({ glob, recursive, validPaths, invalidPaths }) => {
    it(`matches only suitable paths - ${glob}`, () => {
      const { path: base, recursive: willRecurse, match } = toRequireContext(glob);

      const regex = new RegExp(match);

      function isMatched(filePath) {
        const relativePath = `./${path.relative(base, filePath)}`;

        const baseIncluded = filePath.includes(base);
        const matched = regex.test(relativePath);

        return baseIncluded && matched;
      }

      const isNotMatchedForValidPaths = validPaths.filter((filePath) => !isMatched(filePath));
      const isMatchedForInvalidPaths = invalidPaths.filter((filePath) => !!isMatched(filePath));

      expect(isNotMatchedForValidPaths).toEqual([]);
      expect(isMatchedForInvalidPaths).toEqual([]);
      expect(willRecurse).toEqual(recursive);
    });
  });
});
