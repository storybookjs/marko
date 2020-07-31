module.exports = {
  frameworks: ['react', 'react-ts', 'vue', 'angular'],
  frameworkSupport: [
    {
      feature: 'Actions',
      unsupported: [],
      path: '/essentials/actions',
    },
    // These are just for testing purposes, please fill in with real values
    {
      feature: 'Viewports',
      unsupported: ['vue'],
      path: '/essentials/viewports',
    },
    {
      feature: 'Backgrounds',
      supported: ['react'],
      path: '/essentials/backgrounds',
    },
  ],
};
