import {getList as getGoodList, goodCategory} from '@/api/good'
import {getList as bannerList} from '@/api/banner'
import moment from 'moment'
import CountDownTime from '@/pages/seckill/components/CountDownTime';
import {getList as seckillList} from '@/api/seckill'
import {verifyPlugin} from '@/api/plugin'
export default {
  components: {
    CountDownTime
  },
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
      isSeckill: false,
      seckill: [],
      seckillTime: 0,
      seckillActiveTime: '',
      seckillLoading: false
    }
  },
  async asyncData (ctx) {
    try {
      let time = moment().format('YYYY-MM-DD HH:00:00')
      if(moment().format('HH')%2 !== 0){
        time = moment().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00')
      }
      let endTime = (moment(time, "YYYY-MM-DD HH:00:00").add(2, 'hour')-moment().valueOf())/1000
      let [goodData, bannerData, categoryData, recommendCategoryData, verifyPluginData] = await Promise.all([
        getGoodList({
          limit: 10,
          is_recommend: 1
        }),
        bannerList({
          limit: 5,
          type: 0,
          state: 0,
          sort: '+sort'
        }),
        goodCategory({
          tree: true
        }),
        goodCategory({
          is_recommend: 1
        }),
        verifyPlugin(['seckill'])
      ])
      bannerData.data.forEach(item=>{
        item.url = item.url ? item.url.replace('?id=','/') : ''
      })
      return {
        goodList: goodData.data,
        bannerList: bannerData.data,
        categoryList: categoryData,
        recommendCategoryList: recommendCategoryData,
        seckillActiveTime: moment(time, "YYYY-MM-DD HH:00:00").format('HH:00'),
        seckillTime: endTime,
        isSeckill: verifyPluginData.seckill,
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  mounted() {
    this.categoryGood();
    this.getBanner()
    if(this.isSeckill){
      this.endSeckillTime()
    }
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
        state: 0,
        sort: '+sort'
      }).then(response => {
        this.banner = response.data[0]
        this.banner.url = this.banner.url ? this.banner.url.replace('?id=','/') : ''
      })
    },
    // 秒杀倒计时结束
    endSeckillTime() {
      this.seckillLoading = true
      let time = moment().format('YYYY-MM-DD HH:00:00')
      if(moment().format('HH')%2 !== 0){
        time = moment().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00')
      }
      this.seckillActiveTime = moment(time, "YYYY-MM-DD HH:00:00").format('HH:00')
      this.seckillTime = (moment(time, "YYYY-MM-DD HH:00:00").add(2, 'hour')-moment().valueOf())/1000
      seckillList({
        limit: 5,
        time: time,
        sort: '-id',
        state: 1
      }).then(response => {
        this.seckill = response.data
      }).finally(()=>{
        this.seckillLoading = false
      })
    }
  }
}
