module.exports = {
  outputDir: '../server/app/views/',
  devServer: {
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT
  }
}