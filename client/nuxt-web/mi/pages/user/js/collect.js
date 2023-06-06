import {getList, destroy} from '@/api/collect'
export default {
  layout: 'user',
  head () {
    return {
      title: `${this.$t('header.top.collection')}-${this.$t('header.top.personal_center')}`,
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
      this.$confirm(this.$t('hint.whether_confirm', {attribute:this.$t('common.delete') }), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        destroy(id).then(response => {
          this.handleFilter();
          this.$message({
            message: this.$t('common.success'),
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
