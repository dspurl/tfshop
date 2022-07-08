import {getList as bannerList} from '@/api/banner'
export default {
  data() {
    return {
      icp: process.env.APP_ICP,
      year: new Date().getFullYear(),
      domain: process.env.APP_SHORT_NAME,
      link: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      bannerList({
        limit: 20,
        type: 3,
        state: 0,
        sort: '+sort'
      }).then(response => {
        this.link = response.data
      })
    }
  }
}
