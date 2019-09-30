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
    // dll: {
    //   entry: ['vue-route', 'vue-router'],
    //   output: '/Users/yubh/haoweilai/cactus-data-pc/public/dll',
    //   open: true
    // },
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
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
