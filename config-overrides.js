const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = (config, env) => {
  config = rewireReactHotLoader(config, env);
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-dom': '@hot-loader/react-dom',
  };
  config.target = 'electron-renderer';
  return config;
};
