import { getList, cancel, destroy, receipt } from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的订单-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      goodIndentList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        index: '0',
        sort: '-created_at',
      }
    }
  },
  mounted() {
    if($nuxt.$route.query.index){
      this.listQuery.index = $nuxt.$route.query.index
    }
    this.getList()
  },
  methods: {
    async getList(){
      this.loading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([goodIndent]) => {
        this.goodIndentList = goodIndent.data;
        goodIndent.data.forEach(item=>{
          item.goods_list.forEach(items=>{
            if(items.good_sku){
              items.good_sku.product_sku.forEach(item2=>{
                if(items.specification){
                  items.specification+= item2.value + ';'
                }else{
                  items.specification = item2.value + ';'
                }
              })
              items.specification = items.specification.substr(0,items.specification.length-1)
            }
          })
        })
        this.total = goodIndent.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    getReloadList(){
      this.listQuery.page = 1;
      this.getList()
    },
    //取消订单
    cancelOrder(item){
      this.$confirm('是否确认取消订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        cancel(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '取消成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    // 删除订单
    deleteOrder(item){
      this.$confirm('是否确认删除订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        destroy(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    // 确认收货
    confirmReceipt(item){
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        receipt(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    }
  }
}
