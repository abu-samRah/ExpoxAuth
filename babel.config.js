const ReactCompilerConfig = {
  target: '18',
};

module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
    presets: [['babel-preset-expo']],
  };
};
