export default class Provider {
  getElements() {
    throw new Error('Provider.getElements() is not implemented!');
  }

  handleAPI() {
    throw new Error('Provider.handleAPI() is not implemented!');
  }

  getConfig() {
    console.error('Provider.getConfig() is not implemented!');

    return {};
  }
}
