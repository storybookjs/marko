import { window, document } from 'global';
import Channel, { ChannelEvent, ChannelHandler } from '@storybook/channels';
import { logger } from '@storybook/client-logger';

import { isJSON, parse, stringify } from 'telejson';

interface Config {
  page: 'manager' | 'preview';
}

interface BufferedEvent {
  event: ChannelEvent;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export const KEY = 'storybook-channel';

// TODO: we should export a method for opening child windows here and keep track of em.
// that way we can send postMessage to child windows as well, not just iframe
// https://stackoverflow.com/questions/6340160/how-to-get-the-references-of-all-already-opened-child-windows

export class PostmsgTransport {
  private buffer: BufferedEvent[];

  private handler: ChannelHandler;

  private connected: boolean;

  constructor(private readonly config: Config) {
    this.buffer = [];
    this.handler = null;
    window.addEventListener('message', this.handleEvent.bind(this), false);

    // Check whether the config.page parameter has a valid value
    if (config.page !== 'manager' && config.page !== 'preview') {
      throw new Error(`postmsg-channel: "config.page" cannot be "${config.page}"`);
    }
  }

  setHandler(handler: ChannelHandler): void {
    this.handler = (...args) => {
      handler.apply(this, args);

      if (!this.connected && this.getFrames().length) {
        this.flush();
        this.connected = true;
      }
    };
  }

  /**
   * Sends `event` to the associated window. If the window does not yet exist
   * the event will be stored in a buffer and sent when the window exists.
   * @param event
   */
  send(event: ChannelEvent, options?: any): Promise<any> {
    const frames = this.getFrames();
    if (!frames.length || this.buffer.length) {
      return new Promise((resolve, reject) => {
        this.buffer.push({ event, resolve, reject });
      });
    }

    let depth = 15;
    let allowFunction = true;

    if (options && typeof options.allowFunction === 'boolean') {
      allowFunction = options.allowFunction;
    }
    if (options && Number.isInteger(options.depth)) {
      depth = options.depth;
    }

    const data = stringify(
      { key: KEY, event, source: document.location.origin + document.location.pathname },
      { maxDepth: depth, allowFunction }
    );

    // TODO: investigate http://blog.teamtreehouse.com/cross-domain-messaging-with-postmessage
    // might replace '*' with document.location ?
    frames.forEach(f => {
      try {
        f.postMessage(data, '*');
      } catch (e) {
        console.error('sending over postmessage fail');
      }
    });
    return Promise.resolve(null);
  }

  private flush(): void {
    const { buffer } = this;
    this.buffer = [];
    buffer.forEach(item => {
      this.send(item.event)
        .then(item.resolve)
        .catch(item.reject);
    });
  }

  private getFrames(): Window[] {
    if (this.config.page === 'manager') {
      return [...document.getElementsByTagName('iframe')]
        .filter(e => {
          try {
            return !!e.contentWindow && e.dataset.isStorybook !== undefined;
          } catch (er) {
            return false;
          }
        })
        .map(e => e.contentWindow);
    }
    if (window && window.parent) {
      return [window.parent];
    }

    return [];
  }

  private handleEvent(rawEvent: MessageEvent): void {
    try {
      const { data } = rawEvent;
      const { key, event, source } = typeof data === 'string' && isJSON(data) ? parse(data) : data;
      if (key === KEY) {
        event.source = source || getEventSourceUrl(rawEvent);
        logger.debug(
          `message arrived at ${this.config.page} from ${event.source}`,
          event.type,
          ...event.args
        );
        this.handler(event);
      }
    } catch (error) {
      logger.error(error);
      // debugger;
    }
  }
}

const getEventSourceUrl = (event: MessageEvent) => {
  const frames: HTMLIFrameElement[] = [...document.getElementsByTagName('iframe')];
  let result = event.origin;
  let frame;
  let remainder;
  try {
    // try to find the originating iframe by matching it's contentWindow
    // This might not be cross-origin safe
    [frame, ...remainder] = frames.filter(element => element.contentWindow === event.source);

    const src = frame.getAttribute('src');
    const { pathname, origin } = new URL(src);

    result = origin + pathname;
  } catch (e) {
    // if the contentWindow access was not allowed we match on origin alone
    [frame, ...remainder] = frames.filter(element => {
      const src = element.getAttribute('src');
      const { origin } = new URL(src);

      return origin === event.origin;
    });
  }

  // If we found multiple matches, there's going to be trouble
  if (remainder.length) {
    console.error('unable to locate origin of postmessage');
    return null;
  }

  return result;
};

/**
 * Creates a channel which communicates with an iframe or child window.
 */
export default function createChannel({ page }: Config): Channel {
  const transport = new PostmsgTransport({ page });
  return new Channel({ transport });
}
