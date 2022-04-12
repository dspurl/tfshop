import {good} from '@/api/comment'
export default {
  data() {
    return {
      list: [],
      imgList: [],
      listQuery: {
        limit: 10,
        page: 1,
        good_id: 0,
        sort:'-created_at'
      },
      loading: false,
      total: 0
    }
  },
  mounted() {
    if(!$nuxt.$route.params.id){
      this.$message.error('参数有误');
      $nuxt.$router.go(-1);
      return false
    }
    this.listQuery.good_id = $nuxt.$route.params.id
    this.getList()
  },
  methods: {
    getList(){
      this.loading = true;
      Promise.all([
        good(this.listQuery)
      ]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }
  }
}
