## Standalone Mode

Storybook can be run standalone from Node, although it should be noted this isn't officially supported any more.

```js
const storybook = require('@storybook/{APP}/standalone');

storybook({
  // options
});
```

Where the APP is one of the supported apps. For example:

```js
const storybook = require('@storybook/react/standalone');

storybook({
  // options
});
```

## Mode

Mode is defining what Storybook mode will be applied:

### dev

run Storybook in a dev mode - similar to `start-storybook` in CLI

```js
const storybook = require('@storybook/react/standalone');

storybook({
  mode: 'dev',
  // other options
});
```

### static

build static version of Storybook - similar to `build-storybook` in CLI

```js
const storybook = require('@storybook/react/standalone');

storybook({
  mode: 'static',
  // other options
});
```

Other options are similar to those in the CLI.

## For "dev" mode:

```plaintext
port [number]           Port to run Storybook
host [string]           Host to run Storybook
staticDir <dir-names>   Directory where to load static files from, array of string mappings between localDir and remote path
configDir [dir-name]    Directory where to load Storybook configurations from
https                   Serve Storybook over HTTPS. Note: You must provide your own certificate information.
sslCa <ca>              Provide an SSL certificate authority. (Optional with "https", required if using a self-signed certificate)
sslCert <cert>          Provide an SSL certificate. (Required with "https")
sslKey <key>            Provide an SSL key. (Required with "https")
smokeTest               Exit after successful start
ci                      CI mode (skip interactive prompts, don't open browser)
quiet                   Suppress verbose build output
```

## For "static" mode:

```plaintext
staticDir <dir-names>   Directory where to load static files from, array of strings mappings between localDir and remote path
outputDir [dir-name]    Directory where to store built files
configDir [dir-name]    Directory where to load Storybook configurations from
watch                   Enable watch mode
quiet                   Suppress verbose build output
```

Example:

```js
const storybook = require('@storybook/angular/standalone');

storybook({
  mode: 'dev',
  port: 9009,
  configDir: './.storybook',
  staticDir: ['localDir', 'localDir/images:/images/public']
});
```
