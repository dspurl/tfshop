import { getList, cancel, destroy, receipt } from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: `${this.$t('header.top.order')}-${this.$t('header.top.personal_center')}`,
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
  async asyncData (ctx) {
    try {
    } catch(err) {
      ctx.$errorHandler(err)
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
      this.$confirm(this.$t('hint.whether_confirm',{attribute:this.$t('indent.cancel_order')}), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        cancel(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: this.$t('common.success'),
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
      this.$confirm(this.$t('hint.whether_confirm',{attribute:this.$t('indent.delete_order')}), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        destroy(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: this.$t('common.success'),
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
      this.$confirm(this.$t('hint.whether_confirm',{attribute:this.$t('indent.receiving')}), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        receipt(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: this.$t('common.success'),
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
