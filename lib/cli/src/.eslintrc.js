const ignore = 0;

module.exports = {
  overrides: [
    {
      files: '**/template[-?]*/**',
      env: {
        browser: true,
      },
      rules: {
        'react/no-this-in-sfc': ignore,
        'import/no-unresolved': ignore,
        'react/react-in-jsx-scope': ignore,
        'import/no-extraneous-dependencies': ignore,
        'global-require': ignore,
        'no-redeclare': ignore,
      },
    },
    {
      files: 'REACT_NATIVE/template/**',
      env: {
        browser: false,
      },
    },
    {
      files: 'frameworks/**/*',
      env: {
        browser: true,
      },
      rules: {
        'jsx-a11y/anchor-is-valid': ignore,
        'import/no-unresolved': ignore,
        'react/prop-types': ignore,
        'react/react-in-jsx-scope': ignore,
        'import/no-extraneous-dependencies': ignore,
        'import/extensions': ignore,
        'import/named': ignore,
      },
    },
  ],
};
