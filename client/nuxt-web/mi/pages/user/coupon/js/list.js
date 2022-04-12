import {getUserList} from '@/api/coupon'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的优惠券-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      list: [],
      total: 0,
      listQuery: {
        limit: 12,
        index: '1',
        page: 1,
        sort: '-created_at'
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
        getUserList(this.listQuery)
      ]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    },
    getReloadList(){
      this.listQuery.page = 1;
      this.getList()
    },
    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handleAllDelete() { // 批量删除
      if(this.multipleSelection.length === 0){
        this.$message({
          message: '请选择需要操作的内容',
          type: 'error'
        });
        return false
      }
      this.$confirm('是否确认删除选中内容？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        destroy(this.multipleSelection).then(response => {
          this.buttonLoading = false;
          this.handleFilter();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    }
  }
}
