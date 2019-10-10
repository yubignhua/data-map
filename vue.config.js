const path = require('path')
// const name = 'Camel custom service'
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const env = process.env.NODE_ENV

// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
// const IS_TEST = ['test'].includes(process.env.NODE_ENV)
// const IS_DEVELOPMENT = ['development'].includes(process.env.NODE_ENV)
// const IS_STAGE = ['stage'].includes(process.env.VUE_APP_API_NAME)

// 打印当前环境变量
console.warn(process.env.NODE_ENV)
console.warn(process.env.VUE_APP_API_URL)

module.exports = {
  transpileDependencies: [
    'vuex-module-decorators'
  ],
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        '/Users/yubh/Desktop/workspace/data-map/src/styles/_variables.scss',
        '/Users/yubh/Desktop/workspace/data-map/src/styles/_mixins.scss'
      ]
    },
    dll: {
      entry: {
        vendor: ['vue', 'vue-router', 'element-ui']
      },
      open: true,
      inject: true
    }
  },
  configureWebpack: (config) => {
    if (env === 'production') {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
        threshold: 10240,
        minRatio: 0.8
      }))
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/_mixins.scss";'
      }
    }
  }
}
