import {getList, destroy} from '@/api/collect'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的收藏-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      collectList: [],
      total: 0,
      listQuery: {
        limit: 10,
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
        getList(this.listQuery)
      ]).then(([collectData]) => {
        this.collectList = collectData.data;
        this.total = collectData.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    destroy(id){
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroy(id).then(response => {
          this.handleFilter();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {

        })
      }).catch(() => {
      })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
  }
}
