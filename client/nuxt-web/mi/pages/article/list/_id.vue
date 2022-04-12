<template>
  <div class="box">
    <component :listQuery="listQuery" :loading="loading" :is="template" :data="data" @getList="getList"/>
  </div>
</template>
<style lang='scss' scoped>

</style>
<script>
import defaultColumn from '../components/defaultColumn'
import defaultColumnDetail from '../components/defaultColumnDetail'
import { getList as getArticleList } from '@/api/article'
import { pv } from '@/api/column'
export default {
  components: { defaultColumn, defaultColumnDetail },
  data() {
    return {
      template: '',
      data: {},
      loading: false,
      listQuery: {},
    }
  },
  async asyncData (ctx) {
    try {
      const { query,params } = ctx;
      let listQuery = {
        limit: 10,
        page: query.page ? query.page : 1
      }
      let [ columnData ] = await Promise.all([
        getArticleList(params.id, listQuery)
      ]);
      return {
        data: columnData,
        listQuery: listQuery
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.$nextTick(() => {
          this.listQuery.page = 1
          this.getList()
        })
      }
    }
  },
  head () {
    return {
      title: this.data.column.name + '-' + process.env.APP_NAME,
      meta: [
        { hid: 'index', name: this.data.column.name + '-' + process.env.APP_NAME, content: this.data.column.keywords ? this.data.column.keywords : process.env.APP_KEYWORD },
        { hid: 'description', name: 'description', content: this.data.column.short_description ? this.data.column.short_description : process.env.APP_DESCRIPTION }
      ]
    }
  },
  mounted() {
    this.template = this.data.column.template
    if(this.data.column.list !== 1){
      this.setPV()
    }
  },
  methods: {
    getList(){
      this.loading = true
      getArticleList($nuxt.$route.params.id, this.listQuery).then(response => {
        this.data = response
        this.loading = false
        this.template = this.data.column.template
        if(this.data.column.list !== 1){
          this.setPV()
        }
      })
    },
    setPV(){
      pv($nuxt.$route.params.id)
    }
  }
}

</script>
