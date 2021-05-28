export default {
  data() {
    return {
      icp: process.env.APP_ICP,
      year: new Date().getFullYear(),
      domain: process.env.APP_SHORT_NAME
    }
  }
}
