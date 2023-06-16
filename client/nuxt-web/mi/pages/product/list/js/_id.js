import {getList as getGoodList} from '@/api/good'
export default {
  data() {
    return {
      list: [],
      listQuery: {},
      loading: false,
      total: 0,
      title: ''
    }
  },
  async asyncData (ctx) {
    try {
      const { query, params } = ctx;
      const listQuery={
        limit: 20,
        page: 1,
        sort: '',
        category_id: params.id,
        title: query.title
      };
      let [goodData] = await Promise.all([
        getGoodList(listQuery)
      ])
      return {
        list: goodData.data,
        total: goodData.total,
        listQuery: listQuery,
        title: params.id ? query.name : query.title
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: this.title + (this.listQuery.category_id ? `-${this.$t('product.classify')}-`: `-${this.$t('product.search_result')}-`) + process.env.APP_NAME
    }
  },
  watch: {
    '$route.query.title': {
      handler(newVal,oldVal){
        this.title = this.listQuery.title = newVal
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    getList(){
      this.loading = true;
      Promise.all([
        getGoodList(this.listQuery)
      ]).then(([goodData]) => {
        this.list = goodData.data;
        this.total = goodData.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    },
    //筛选点击
    tabClick(index){
      if(index){
        if(index === 'sales'){
          this.listQuery.sort = '-sales'
        }else{
          if(this.listQuery.sort !== '+order_price'){
            this.listQuery.sort = '+order_price'
          }else{
            this.listQuery.sort = '-order_price'
          }
        }
      }else{
        this.listQuery.sort = ''
      }
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList()
    }
  }
}
