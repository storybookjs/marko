import path from 'path';
import { toRequireContext } from './to-require-context';

const testCases = [
  {
    glob: '**/*.stories.tsx',
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
  {
    glob: '../src/stories/**/*.stories.(js|mdx)',
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
    validPaths: [
      './dirname/../stories/App.stories.js',
      './dirname/../stories/addon-centered.stories.js',
    ],
    invalidPaths: ['./dirname/../stories.js', './dirname/../App.stories.js'],
  },
];

describe('toRequireContext', () => {
  it('matches only suitable paths', () => {
    testCases.forEach(({ glob, validPaths, invalidPaths }) => {
      const { path: base, match: regex } = toRequireContext(glob);

      function isMatched(filePath) {
        const relativePath = `./${path.relative(base, filePath)}`;
        return filePath.includes(base) && regex.test(relativePath);
      }

      const isMatchedForValidPaths = validPaths.every(isMatched);
      const isMatchedForInvalidPaths = invalidPaths.every(filePath => !isMatched(filePath));

      expect(isMatchedForValidPaths).toBe(true);
      expect(isMatchedForInvalidPaths).toBe(true);
    });
  });
});
