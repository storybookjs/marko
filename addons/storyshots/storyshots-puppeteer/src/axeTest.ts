import '@wordpress/jest-puppeteer-axe';
import { defaultAxeConfig, AxeConfig } from './config';
import { puppeteerTest } from './puppeteerTest';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace,no-redeclare
  namespace jest {
    interface Matchers<R, T> {
      toPassAxeTests(parameters: any): R;
    }
  }
}

export const axeTest = (customConfig: Partial<AxeConfig> = {}) => {
  const config = { ...defaultAxeConfig, ...customConfig };
  const { beforeAxeTest } = config;

  puppeteerTest({
    ...config,
    async testBody(page, options) {
      const parameters = options.context.parameters.a11y;
      const include = parameters?.element ?? '#root';
      await beforeAxeTest(page, options);
      await expect(page).toPassAxeTests({ ...parameters, include });
    },
  });
};
