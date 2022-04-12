import {getList as getBrowseList} from '@/api/browse'
import {detail as getUserDetail} from '@/api/user'
import {quantity} from '@/api/goodIndent'
import {verifyPlugin} from '@/api/plugin'
export default {
  layout: 'user',
  head () {
    return {
      title: '个人中心',
    }
  },
  async asyncData (ctx) {
    try {
      let [ verifyPluginData ] = await Promise.all([
        verifyPlugin(['integral','comment']),
      ]);
      return {
        isIntegral: verifyPluginData.integral,
        isComment: verifyPluginData.comment
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  data() {
    return {
      isIntegral: false,
      isComment: false,
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
