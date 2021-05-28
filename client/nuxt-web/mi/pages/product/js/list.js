import {getList as getGoodList} from '@/api/good'
export default {
  data() {
    return {
      goodList: [],
      listQuery: {},
      loading: false,
      total: 0,
      title: ''
    }
  },
  async asyncData (ctx) {
    try {
      const { query } = ctx;
      const listQuery={
        limit: 20,
        page: 1,
        sort: '',
        category_id: query.pid,
        title: query.pid ? '': query.title
      };
      let [goodData] = await Promise.all([
        getGoodList(listQuery)
      ])
      return {
        goodList: goodData.data,
        total: goodData.total,
        listQuery: listQuery,
        title: query.title ? query.title : '全部商品'
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: this.title + (this.listQuery.pid ? '-商品分类-': '-搜索结果-') + process.env.APP_NAME
    }
  },
  methods: {
    getList(){
      this.loading = true;
      Promise.all([
        getGoodList(this.listQuery)
      ]).then(([goodData]) => {
        this.goodList = goodData.data;
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
