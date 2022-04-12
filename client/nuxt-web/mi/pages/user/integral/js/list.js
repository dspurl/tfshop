import {getList} from '@/api/integralLog'
export default {
  layout: 'user',
  head () {
    return {
      title: '积分明细-个人中心',
    }
  },
  data() {
    return {
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '-id',
        type: '',
        timeInterval: ''
      },
      loading: false,
      total: 0,
      income: 0,
      expend: 0,
      pickerOptions: {
        shortcuts: [{
          text: "最近一周",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: "最近三个月",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      this.loading = true;
      getList(this.listQuery).then(response => {
        this.list = response.paginate.data
        this.total = response.paginate.total
        this.income = response.income
        this.expend = response.expend
      }).finally(()=>{
        this.loading = false
      })
    },
    handleFilter() {
      this.getList()
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
  }
}
