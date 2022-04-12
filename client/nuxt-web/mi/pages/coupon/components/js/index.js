import {getList, create} from '@/api/coupon'
export default {
  name: 'CouponIndex',
  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      list: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at'
      }
    }
  },
  mounted() {
    if($nuxt.$store.state.hasLogin){
      this.getList()
    }
  },
  methods: {
    async getList(){
      this.loading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    },
    popover(){
      if(!$nuxt.$store.state.hasLogin){
        $nuxt.$store.commit('loginCheck');
        return false
      }
    },
    // 领取
    getCreate(item){
      this.buttonLoading = true
      create(item).then(() => {
        this.getList()
        this.buttonLoading = false
        this.$message({
          message: '领取成功',
          type: 'success'
        })
      })
    }
  }
}
