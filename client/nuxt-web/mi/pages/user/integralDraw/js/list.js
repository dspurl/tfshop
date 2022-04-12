import {getList} from '@/api/integralDraw'

export default {
  layout: 'user',
  head() {
    return {
      title: '积分抽奖-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at'
      },
      integralDraw: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.listQuery.integral_draw_id = $nuxt.$route.query.id
      getList(this.listQuery).then(item => {
        this.integralDraw = item.data;
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
