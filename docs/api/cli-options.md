---
title: 'CLI options'
---

Storybook comes with two CLI utilities: `start-storybook` and `build-storybook`.

Pass these commands the following options to alter Storybook's behavior.

## start-storybook

```plaintext
Usage: start-storybook [options]
```

| Options                        | Description                                                                                                                                    | Example                                         |
| ------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| --help                         | Output usage information                                                                                                                       | `start-storybook --help`                        |
| -V, --version                  | Output the version number                                                                                                                      | `start-storybook -V`                            |
| -p, --port [number]            | Port to run Storybook                                                                                                                          | `start-storybook -p 9009`                       |
| -h, --host [string]            | Host to run Storybook                                                                                                                          | `start-storybook -h http://my-host.com`         |
| -s, --static-dir `<dir-names>` | Directory where to load static files from, comma-separated list                                                                                | `start-storybook -s public`                     |
| -c, --config-dir [dir-name]    | Directory where to load Storybook configurations from                                                                                          | `start-storybook -c .storybook`                 |
| --https                        | Serve Storybook over HTTPS. Note: You must provide your own certificate information.                                                           | `start-storybook --https`                       |
| --ssl-ca `<ca>`                | Provide an SSL certificate authority. (Optional with --https, required if using a self-signed certificate)                                     | `start-storybook --ssl-ca my-certificate`       |
| --ssl-cert `<cert>`            | Provide an SSL certificate. (Required with --https)                                                                                            | `start-storybook --ssl-cert my-ssl-certificate` |
| --ssl-key `<key>`              | Provide an SSL key. (Required with --https)                                                                                                    | `start-storybook --ssl-key my-ssl-key`          |
| --smoke-test                   | Exit after successful start                                                                                                                    | `start-storybook --smoke-test`                  |
| --ci                           | CI mode (skip interactive prompts, don't open browser)                                                                                         | `start-storybook --ci`                          |
| --quiet                        | Suppress verbose build output                                                                                                                  | `start-storybook --quiet`                       |
| --no-dll                       | Do not use dll reference (no-op)                                                                                                               | `start-storybook --no-dll`                      |
| --debug-webpack                | Display final webpack configurations for debugging purposes                                                                                    | `start-storybook --debug-webpack`               |
| --docs                         | Starts Storybook in documentation mode. Learn more about it in [here](../writing-docs/build-documentation.md#preview-storybooks-documentation) | `start-storybook --docs`                        |

## build-storybook

```plaintext
Usage: build-storybook [options]
```

<details>

    <summary><h4>Troubleshooting routing issues with Storybook 6.0</h4></summary>

    If you are building your Storybook and you encounter an issue where you cannot change the route in the sidebar, try building Storybook with the `--no-dll` flag and see if it solves the problem. If so, adjust your `build-storybook` script accordingly to include this flag. We would like to point out that your build process will run slower than usual when using this flag.

    If you want, you can take a look at the following <a href="https://github.com/storybookjs/storybook/issues/11958"> issue </a> to get an in depth description of what is currently happening with your built Storybook.

</details>

| Options                        | Description                                                                                                                                     | Example                                     |
| ------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| -h, --help                     | Output usage information                                                                                                                        | `build-storybook --help`                    |
| -V, --version                  | Output the version number                                                                                                                       | `build-storybook -V`                        |
| -s, --static-dir `<dir-names>` | Directory where to load static files from, comma-separated list                                                                                 | `build-storybook -s public`                 |
| -o, --output-dir [dir-name]    | Directory where to store built files                                                                                                            | `build-storybook -o /my-deployed-storybook` |
| -c, --config-dir [dir-name]    | Directory where to load Storybook configurations from                                                                                           | `build-storybook -c .storybook`             |
| -w, --watch                    | Enables watch mode                                                                                                                              | `build-storybook -w`                        |
| --loglevel [level]             | Controls level of logging during build. Can be one of: [silly, verbose, info (default), warn, error, silent]                                    | `build-storybook --loglevel warn`           |
| --quiet                        | Suppress verbose build output                                                                                                                   | `build-storybook --quiet`                   |
| --no-dll                       | Do not use dll reference (no-op)                                                                                                                | `build-storybook --no-dll`                  |
| --debug-webpack                | Display final webpack configurations for debugging purposes                                                                                     | `build-storybook --debug-webpack`           |
| --docs                         | Builds Storybook in documentation mode. Learn more about it in [here](../writing-docs/build-documentation.md#publish-storybooks-documentation)) | `build-storybook --docs`                    |
