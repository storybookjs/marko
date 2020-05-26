/**
 * Returns true if the framework can use the base TS config.
 * @param {string} framework
 */
export const useBaseTsSupport = (framework) => {
  // These packages both have their own TS implementation.
  return !['vue', 'angular'].includes(framework);
};
