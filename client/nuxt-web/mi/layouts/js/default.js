export default {
  data() {
    return {
      isDev: process.env.APP_ENV === 'local'
    }
  },
}
