import { getList } from '@/api/integral'
import Pagination from '@/components/Pagination'
export default {
  name: 'IntegralList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      formLoading: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        keyword: ''
      }
    }
  },
  activated() {
    this.getList()
    window.scrollTo(0, 1)
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    }
  }
}
