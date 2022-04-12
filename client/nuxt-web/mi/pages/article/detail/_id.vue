<template>
  <div class="box">
    <component :is="template" :loading="loading" :data="data"/>
  </div>
</template>
<style lang='scss' scoped>

</style>
<script>
import defaultArticle from '../components/defaultArticle'
import { detail as getArticleDetailList, pv } from '@/api/article'
export default {
  components: { defaultArticle },
  data() {
    return {
      template: '',
      data: '',
      loading: false
    }
  },
  async asyncData (ctx) {
    try {
      const { params } = ctx;
      let [ articleDetailData ] = await Promise.all([
        getArticleDetailList(params.id)
      ]);
      return {
        data: articleDetailData
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: this.data.name + '-' + process.env.APP_NAME,
      meta: [
        { hid: 'index', name: this.data.name + '-' + process.env.APP_NAME, content: this.data.keywords ? this.data.keywords : process.env.APP_KEYWORD },
        { hid: 'description', name: 'description', content: this.data.short_description ? this.data.short_description : process.env.APP_DESCRIPTION }
      ]
    }
  },
  mounted() {
    this.template = this.data.template
    this.setPV()
  },
  methods: {
    setPV(){
      pv($nuxt.$route.params.id)
    }
  }
}
</script>
