import dsLuckyWheel from '../components/dsLuckyWheel'
import dsLuckyGrid from '../components/dsLuckyGrid'
import dsSlotMachine from '../components/dsSlotMachine'
import {detail} from '@/api/integralDraw'
import {getList} from '@/api/integralDrawLog'

export default {
  layout: 'user',
  components: {
    dsLuckyWheel,
    dsLuckyGrid,
    dsSlotMachine
  },
  head() {
    return {
      title: '抽奖-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      tableLoading: false,
      data: null,
      integralDrawLog: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        integral_draw_id: ''
      }
    }
  },
  mounted() {
    this.getDetail()
    this.getData()
  },
  methods: {
    getData() {
      this.tableLoading = true
      this.listQuery.integral_draw_id = $nuxt.$route.query.id
      getList(this.listQuery).then(item => {
        this.integralDrawLog = item.data;
        this.total = item.total;
        this.tableLoading = false
      }).catch((error) => {
        this.tableLoading = false
      })
    },
    getDetail() {
      if (!$nuxt.$route.query.id) {
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        return false
      }
      detail($nuxt.$route.query.id).then((item) => {
        this.data = item
        this.loading = false
      }).finally((error) => {
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
