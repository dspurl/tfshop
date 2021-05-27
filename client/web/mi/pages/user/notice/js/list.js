import {getList, destroy, read} from '@/api/notification'
export default {
  layout: 'user',
  head () {
    return {
      title: '消息通知-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      noticeList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        pc: true
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      this.tableLoading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([notificationData]) => {
        this.noticeList = notificationData.data;
        this.total = notificationData.total;
        this.loading = false;
        this.tableLoading = false
      }).catch((error) => {
        this.loading = false;
        this.tableLoading = false
      })
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
    },
    handleAllRead() { // 批量标记为已读
      if(this.multipleSelection.length === 0){
        this.$message({
          message: '请选择需要操作的内容',
          type: 'error'
        });
        return false
      }
      this.buttonLoading = true
      read(this.multipleSelection).then(response => {
        this.buttonLoading = false;
        this.getList();
        this.$message({
          message: '标记成功',
          type: 'success'
        });
      }).catch(() => {
        this.buttonLoading = false
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
      this.listQuery.page = 1;
      this.getList()
    },
  }
}
