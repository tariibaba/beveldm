module.exports = config => {
  config.target = 'electron-renderer';
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: 'file-loader'
  });

  return config;
};
