---
title: 'Integration'
---

### Webpack

Storybook displays your components in a custom web application built using [webpack](https://webpack.js.org/). Webpack is a complex tool but our default configuration is intended to cover off the majority of use cases. There are also [addons](/addons) available that extend the configuration for other common use cases.

You can customize Storybook's webpack setup by providing a `webpackFinal` field in [`.storybook/main.js`](./overview#configure-your-storybook-project) file.

The value should be an async function that receives a webpack config and eventually returns a webpack config.

#### Default configuration

By default, Storybook's webpack configuration will allow you to:

- Import Images and other static files

    You can import images and other local files and have them built into the Storybook:

    ```js
    // This will include './static/image.png' in the bundle and return a path to be included in a src attribute
    import imageFile from './static/image.png';
    ```

- Import JSON as JavaScript

    You can import `.json` files and have them expanded to a JavaScript object:

    ```js
    // This will automatically be parsed to the contents of `data.json`
    import data from './data.json';
    ```

If you want to know the exact details of the webpack config, the best way is to run:

```sh
yarn storybook --debug-webpack
```

#### Extending Storybook’s webpack config

To extend the above configuration, use the `webpackFinal` field of [`.storybook/main.js`](./overview#configure-story-rendering).

The value should export a `function`, which will receive the default config as its first argument. The second argument is an options object from Storybook, this will have information about where config came from, whether we're in production of development mode etc.

For example, here's a `.storybook/main.js` to add [Sass](https://sass-lang.com/) support:

```js
// .storybook/main.js

const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  },
};
```

Storybook uses the config returned from the above function to render your components in Storybook's "preview" iframe. Note that Storybook has a completely separate webpack config for its own UI (also referred to as the "manager"), so the customizations you make only applies to the rendering of your stories, i.e. you can completely replace `config.module.rules` if you want.

Nevertheless, edit `config` with care. Make sure to preserve the following config options:

- **entry**
- **output**

Furthermore, `config` requires the `HtmlWebpackplugin` to generate the preview page, so rather than overwriting `config.plugins` you should probably append to it (or overwrite it with care), see [the following issue](https://github.com/storybookjs/storybook/issues/6020) for examples on how to handle this:

```js
module.exports = {
  webpackFinal: (config) => {
    config.plugins.push(...);
    return config;
  },
}
```

Finally, if your custom webpack config uses a loader that does not explicitly include specific file extensions via the `test` property, it is necessary to `exclude` the `.ejs` file extension from that loader.

If you're using a non-standard Storybook config directory, you should put `main.js` there instead of `.storybook` and update the `include` path to make sure that it resolves to your project root.

#### Using your existing config

If you have an existing webpack config for your project and want to reuse this app's configuration, you can import your main webpack config into Storybook's [`.storybook/main.js`](./overview#configure-story-rendering) and merge both:

The following code snippet shows how you can replace the loaders from Storybook with the ones from your app's `webpack.config.js`:

```js
// .storybook/main.js
const path = require('path');

// your app's webpack.config.js
const custom = require('../webpack.config.js');

module.exports = {
  webpackFinal: (config) => {
    return { ...config, module: { ...config.module, rules: custom.module.rules } };
  },
};
```

### Babel

Storybook’s webpack config by [default](#default-configuration) sets up [Babel](https://babeljs.io/) for ES6 transpiling. Storybook works with evergreen browsers and IE11 by default.

Here are some key features of Storybook's Babel configurations.

#### Default configuration

We have added ES2016 support with Babel for transpiling your JS code.

In addition to that, we've added a few additional features, like object spreading and async await.

Check out our [source](https://github.com/storybookjs/storybook/blob/master/lib/core/src/server/common/babel.js) to learn more about these plugins.

#### Custom configuration

If your project has a `.babelrc` file, we'll use that instead of the default config file.

You can also place a `.storybook/.babelrc` file to use a special configuration for Storybook only.


### TypeScript

Storybook has built-in Typescript support, so your Typescript project should work with zero configuration needed.

#### Default configuration

The base Typescript configuration uses [`babel-loader`](https://webpack.js.org/loaders/babel-loader/) for Typescript transpilation, and optionally [`fork-ts-checker-webpack-plugin`](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin) for checking.

Each framework uses the base configuration unless otherwise specified:

- Angular ignores the base and uses `ts-loader` and `ngx-template-loader`.
- Vue ignores the base and uses `ts-loader` and applies it to both `.tsx` and `.vue` files.
- React adds `react-docgen-typescript-plugin` to the base.


#### Main.js configuration

To make it easier to configure Typescript handling, use the `typescript` field in your [`.storybook/main.js`](./overview#configure-story-rendering).

The following code snippets shows the fields for you to use with TypeScript:

```js
// .storybook/main.js
module.exports = {
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};
```

|Field	                         |Framework	    |Description	                                                                          |Type      |
|:-------------------------------|:------------:|:---------------------------------------------------------------------------------------:|:--------:|
|**check**                       |All	          |optionally run fork-ts-checker-webpack-plugin	                                          |boolean   |
|**checkOptions**	               |All	          |Options to pass to fork-ts-checker-webpack-plugin if it's enabled	                      |[See docs](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)  |
|**reactDocgen**	               |React	        |which variant docgen processor to run	`'react-docgen-typescript'                        |N/A       |
|**reactDocgenTypescriptOptions**|React	        |Options to pass to react-docgen-typescript-plugin if react-docgen-typescript is enabled. |[See docs](https://github.com/hipstersmoothie/react-docgen-typescript-plugin)  |



### Styling and CSS

There are many ways to include CSS in a web application, and correspondingly there are many ways to include CSS in Storybook. Usually it is best to try and replicate what your application does with styling in Storybook’s configuration.

#### CSS-in-JS

CSS-in-JS libraries are designed to use basic JavaScript. They often work in Storybook without any extra configuration. Some libraries expect components to be rendered in a specific rendering “context” (for example, to provide themes) and you may need to add a [global decorator](../writing-stories/decorators#global-decorators) to supply it.

#### Importing CSS files

If your component files import their own CSS, Storybook’s webpack config will work unmodified with some exceptions:

- If you are using a CSS precompiler, you may need to add a preset (such as the [SCSS preset](https://github.com/storybookjs/presets/tree/master/packages/preset-scss), or add a loader to Storybook’s webpack config).
- In Angular, you'll need to take special care how you handle CSS:
    - Either [customize your webpack config](#extending-storybooks-webpack-config)
    - Or use syntax to use a inline loader:
        ```js
            import '!style-loader!css-loader!./styles.css';
        ```
    

To use your CSS in all stories, you simply import it in [`.storybook/preview.js`](./overview#configure-story-rendering)

#### Adding webfonts

If you need webfonts to be available, you may need to add some code to the [`.storybook/preview-head.html`](./story-rendering#adding-to-head) file. We recommend including any assets with your Storybook if possible, in which case you likely want to configure the [static file location](#serving-static-files-via-storybook).

### Images and assets

Components often rely on images, videos, and other assets to render as the user expects. There are many ways to use these assets in your story files. 

#### Import assets into stories

You can import any media assets by importing (or requiring) them. This works out of the box with our default config. But, if you are using a custom webpack config, you’ll need to add the file-loader to handle the required files.

Afterwards you can use any asset in your stories:

```js
// your-story-with-assets.story.js

import React from 'react';
import imageFile from './static/image.png';

export default {
  title: 'img',
};

const image = {
  src: imageFile,
  alt: 'my image',
};

export const withAnImage = () => (
  <img src={image.src} alt={image.alt} />
);
```


#### Serving static files via Storybook

We recommend serving static files via Storybook to ensure that your components always have the assets they need to load. 

Configure a directory (or a list of directories) where your assets live when starting Storybook. Use the` -s` flag in your npm script like so:

```json
{
    "scripts": {
        "start-storybook": "start-storybook -s ./public -p 9001"
    }
}
```

Here `./public` is your static directory. Now use it in a component or story like this.

```js
// your-story-with-asset.story.js
import React from 'react';

export default {
  title: 'img',
};

// assume image.png is located in the "public" directory.
export const withAnImage = () => (
  <img src="/image.png" alt="my image" />
);
```

You can also pass a list of directories separated by commas without spaces instead of a single directory.

```json
{
    "scripts": {
        "start-storybook": "start-storybook -s ./public,./static -p 9001"
    }
}
```

#### Reference assets from a CDN

Upload your files to an online CDN and reference them. In this example we’re using a placeholder image service.

```js
// your-story-with-CDN-asset.story.js
import React from 'react';

export default {
  title: 'img',
};

// assume image.png is located in the "public" directory.
export const withAnImage = () => (
  <img src="https://placehold.it/350x150" alt="My CDN placeholder" />
);
```


#### Absolute versus relative paths

Sometimes, you may want to deploy your storybook into a subpath, like `https://example.com/storybook`.

In this case, you need to have all your images and media files with relative paths. Otherwise, the browser cannot locate those files.

If you load static content via importing, this is automatic and you do not have to do anything.

If you are serving assets in a [static directory](#serving-static-files-via-storybook) along with your Storybook, then you need to use relative paths to load images or use the base element.
