import {getList} from '@/api/integralDrawLog'
export default {
  layout: 'user',
  head() {
    return {
      title: '抽奖-个人中心',
    }
  },
  data() {
    return {
      buttonLoading: false,
      loading: true,
      data: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        user: true
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getList(this.listQuery).then(item => {
        this.data = item.data;
        this.total = item.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data;
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else if(order === 'descending') {
        this.listQuery.sort = '-' + prop
      }else{
        this.listQuery.sort = null
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
  }
}
