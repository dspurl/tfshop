import {getList as getGoodList, goodCategory} from '@/api/good'
import {getList as bannerList} from '@/api/banner'
export default {
  data() {
    return {
      categoryStyle: 0,
      naveOn: null,
      goodList: [],
      banner: '',
      bannerList: [],
      categoryList: [],
      categorySublevel:[],
      recommendCategoryList: [],
      recommendGoodList: [],
    }
  },
  async asyncData (ctx) {
    try {
      let [goodData, bannerData, categoryData, recommendCategoryData] = await Promise.all([
        getGoodList({
          limit: 10,
          is_recommend: 1
        }),
        bannerList({
          limit: 5,
          type: 0,
          sort: '+sort'
        }),
        goodCategory({
          tree: true
        }),
        goodCategory({
          is_recommend: 1
        }),
      ])
      return {
        goodList: goodData.data,
        bannerList: bannerData.data,
        categoryList: categoryData,
        recommendCategoryList: recommendCategoryData
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  mounted() {
    this.categoryGood();
    this.getBanner()
  },
  methods: {
    // 分类切换
    naveCut(index){
      if(index !== -1){
        this.naveOn = index;
        if(this.categoryList[index].children){ //存在子类目
          if(this.categoryList[index].children[0].resources){
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 2
          }else{  //存在三级
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 1
          }
        }else{
          this.categorySublevel = []
        }
      }
    },
    // 获取分类商品
    categoryGood() {
      this.recommendCategoryList.forEach((item,index)=>{
        this.recommendGoodList[index] = []
        getGoodList({
          limit: 10,
          category_id: item.id
        }).then(response => {
          this.recommendGoodList[index] = response.data
          this.$forceUpdate()
        })
      })
    },
    // 分类移出
    naveShiftOut(){
      this.naveOn = null;
      this.categoryStyle = 0
    },
    // 首页广告
    getBanner(){
      bannerList({
        limit: 1,
        type: 1,
        sort: '+sort'
      }).then(response => {
        this.banner = response.data[0]
      })
    }
  }
}
