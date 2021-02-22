import { Provider } from '@storybook/ui';
import addons, { AddonStore, Channel, Config, Types } from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';

export default class ReactProvider extends Provider {
  private addons: AddonStore;

  private channel: Channel;

  constructor() {
    super();

    const channel = createChannel({ page: 'manager' });

    addons.setChannel(channel);
    channel.emit(Events.CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;
  }

  getElements(type: Types) {
    return this.addons.getElements(type);
  }

  getConfig(): Config {
    return this.addons.getConfig();
  }

  handleAPI(api: unknown) {
    this.addons.loadAddons(api);
  }
}
