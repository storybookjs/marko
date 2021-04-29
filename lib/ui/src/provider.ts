import { Types } from '@storybook/addons';

export default class Provider {
  getElements(_type: Types) {
    throw new Error('Provider.getElements() is not implemented!');
  }

  handleAPI(_api: unknown) {
    throw new Error('Provider.handleAPI() is not implemented!');
  }

  getConfig() {
    console.error('Provider.getConfig() is not implemented!');

    return {};
  }
}
