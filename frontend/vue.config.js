module.exports = {
  outputDir: '../backend/app/views/',
  devServer: {
    progress: false,
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT
  }
}