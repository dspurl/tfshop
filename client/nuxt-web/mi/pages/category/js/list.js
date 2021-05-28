import {goodCategory as getGoodCategory} from '@/api/good'
export default {
  data() {
    return {
      goodCategory: []
    }
  },
  async asyncData (ctx) {
    try {
      let [ goodCategoryData ] = await Promise.all([
        getGoodCategory({tree: true})
      ]);
      for(let item of goodCategoryData){
        if(item.children){
          item.level = 3;
          for(let item2 of item.children){
            if(item2.resources){
              item.level = 2
            }
            break
          }
        }
      }
      return {
        goodCategory: goodCategoryData
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: '全部商品分类-' + process.env.APP_NAME
    }
  },
  mounted() {

  },
  methods: {

  }
}
