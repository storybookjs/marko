import globBase from 'glob-base';
import { makeRe } from 'micromatch';

// LEGACY support for bad glob patterns we had in SB 5 - remove in SB7
const fixBadGlob = (val) => {
  const match = val.match(/\.(\([^)]+\))/);

  if (match) {
    return match.input.replace(match[1], `@${match[1]}`);
  }

  return val;
};

const isObject = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false;
export const toRequireContext = (input) => {
  const fixedInput = fixBadGlob(input);
  switch (true) {
    case typeof input === 'string': {
      const { base, glob } = globBase(fixedInput);

      const recursive = glob.startsWith('**');
      const indicator = glob.replace(/^(\*\*\/)*/, '');
      const regex = makeRe(indicator, { fastpaths: false, noglobstar: false, bash: true });
      const { source } = regex;

      if (source.startsWith('^')) {
        // prepended '^' char causes webpack require.context to fail
        const match = source.substring(1);

        return { path: base, recursive, match };
      }

      throw new Error(`Invalid glob: >> ${input} >> ${regex}`);
    }
    case isObject(input): {
      return input;
    }

    default: {
      throw new Error('the provided input cannot be transformed into a require.context');
    }
  }
};

export const toRequireContextString = (input) => {
  const { path: p, recursive: r, match: m } = toRequireContext(input);

  const result = `require.context('${p}', ${r}, /${m}/)`;
  return result;
};
