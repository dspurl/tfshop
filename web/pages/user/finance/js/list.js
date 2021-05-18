import { getList } from '@/api/moneyLog'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的账单-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      moneyLogList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        month:'',
        type: 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      this.loading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([goodIndent]) => {
        this.moneyLogList = goodIndent.paginate.data;
        this.total = goodIndent.paginate.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    getReloadList(){
      this.listQuery.page = 1;
      this.getList()
    },
  }
}
