import { Configuration } from 'webpack';

module.exports = async ({ config }: { config: Configuration }) => {
    console.log(config.module.rules);
    console.log(config.plugins);
    return config;
};
