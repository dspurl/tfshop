import {getList as getBrowseList} from '@/api/browse'
import {detail as getUserDetail} from '@/api/user'
import {quantity} from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: '个人中心',
    }
  },
  data() {
    return {
      loading: true,
      user:{},
      browseList: [],
      quantity: {
        all: 0,
        obligation: 0,
        waitdeliver: 0,
        waitforreceiving: 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      await Promise.all([
        getBrowseList({
          limit: 7,
          sort: '-updated_at'
        }),
        getUserDetail(),
        quantity()
      ]).then(([browseData, userData, quantityData]) => {
        this.browseList = browseData.data;
        this.user = userData;
        this.quantity = quantityData;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    }
  }
}
