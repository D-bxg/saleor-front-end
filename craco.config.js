/**
 * antd的配置文件
 */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#0abab5' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};