import {detail} from '@/api/good'
import {create as collectCreate, destroy as collectDestroy, detail as getCollectDetail} from '@/api/collect'
import sku from '@/components/Sku'
import VueVideo from '@/components/VueVideo'
import 'video.js/dist/video-js.css'
import Comment from '@/pages/comment/list'
import {good} from '@/api/comment'
import coupon from '@/pages/coupon/components'
import {verifyPlugin} from '@/api/plugin'
import {detail as seckillDetail} from '@/api/seckill'
import CountDownTime from '@/pages/seckill/components/CountDownTime';
import moment from 'moment'
export default {
  components: {
    sku,
    VueVideo,
    Comment,
    coupon,
    CountDownTime
  },
  data() {
    return {
      tab: 1,
      inventoryFlag: true, //true有货; false 无货
      tabLoading: false,
      goodDetail: {},
      specificationDefaultDisplay: {},
      resources_many: [],
      resources_many_img: [],
      collect: 0,
      poster: '',
      commentTotal: 0,
      seckillActive: false,
      isComment: false,
      isCoupon: false,
      isSeckill: false
    }
  },
  async asyncData (ctx) {
    try {
      const { params } = ctx;
      let inventoryFlag = false
      let [ goodDetailData, verifyPluginData ] = await Promise.all([
        detail(params.id),
        verifyPlugin(['coupon','comment', 'seckill']),
      ]);
      if(goodDetailData.inventory_show > 0){
        inventoryFlag = true
      }
      // 秒杀
      if(verifyPluginData.seckill){
        var isSeckill = false
        await seckillDetail(params.id).then(response => {
          if(response){
            isSeckill = true
            goodDetailData.name = response.name
            goodDetailData.abstract = response.abstract
            goodDetailData.details = response.details
            goodDetailData.state = response.state
            goodDetailData.resources_many = response.resources_many
            goodDetailData.seckill_time = response.time
            goodDetailData.seckill = true
            goodDetailData.price_show = response.price_show
            goodDetailData.seckill_id = response.id // 秒杀ID
            if(response.state){
              goodDetailData.seckillTime = (moment(response.end_time).valueOf()-moment().valueOf())/1000
            }else{
              goodDetailData.seckillTime = (moment(response.time).valueOf()-moment().valueOf())/1000
            }
            const good_sku = JSON.parse(JSON.stringify(goodDetailData.good_sku))
            let seckill_sku = {}
            goodDetailData.good_sku = []
            good_sku.forEach(item =>{
              seckill_sku = response.seckill_sku.find(items => items.good_sku_id === item.id)
              if(seckill_sku){
                item.market_price = seckill_sku.price /100  // 售价
                item.price = seckill_sku.seckill_price /100 // 原价
                item.resources = seckill_sku.resources // sku图片
                item.seckill_sku_id = seckill_sku.id // 秒杀SKU ID
                item.inventory = seckill_sku.residue_limit // 库存
                // 判断秒杀是不限制用户购买量
                if(response.is_purchase_number === 1) {
                  goodDetailData.purchase_number = response.purchase_number
                }
                goodDetailData.good_sku.push(item)
              }
            })
          }
        })
      }
      let resources_many = [];
      let resources_many_img = [];
      let poster;
      if (goodDetailData.resources_many.length > 0) {
        goodDetailData.resources_many.forEach((item,index)=>{
          if(item.depict.indexOf('_video') !== -1){
            item.type = 'video';
            resources_many.unshift(item)
          } else if(item.depict.indexOf('_poster') !== -1){
            poster = item.img
          } else {
            item.type = 'img';
            resources_many.push(item);
            resources_many_img.push(item.img)
          }
        })
      }
      return {
        inventoryFlag: inventoryFlag,
        goodDetail: goodDetailData,
        resources_many: resources_many,
        resources_many_img: resources_many_img,
        poster: poster,
        isCoupon: verifyPluginData.coupon,
        isComment: verifyPluginData.comment,
        isSeckill: isSeckill,
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  head () {
    return {
      title: this.goodDetail.name + '-' + process.env.APP_NAME,
      meta: [
        { hid: 'index', name: this.goodDetail.name + '-' + process.env.APP_NAME, content: this.goodDetail.keywords ? this.goodDetail.keywords : process.env.APP_KEYWORD },
        { hid: 'description', name: 'description', content: this.goodDetail.short_description ? this.goodDetail.short_description : process.env.APP_DESCRIPTION },
        { hid: 'keywords', name: 'keywords', content: this.goodDetail.keywords ? this.goodDetail.keywords : process.env.APP_KEYWORD }
      ]
    }
  },
  mounted() {
    if($nuxt.$store.state.hasLogin){
      this.getCollect()
    }
    if(this.isComment){
      this.getCommentTotal()
    }
  },
  methods: {
    //选择后返回的数据
    purchasePattern(data) {
      this.specificationDefaultDisplay = data;
    },
    buy(state){
      if(!$nuxt.$store.state.hasLogin){
        $nuxt.$store.commit('loginCheck');
        return false
      }
      this.$refs.sku.cart(state)
    },
    getCollect(){
      getCollectDetail($nuxt.$route.params.id).then(response => {
        this.collect = response
      })
    },
    // 收藏
    toCollect() {
      if(!$nuxt.$store.state.hasLogin){
        $nuxt.$store.commit('loginCheck');
        return false
      }
      if(this.collect){
        collectDestroy(this.goodDetail.id)
      }else{
        collectCreate(this.goodDetail)
      }
      this.collect = !this.collect
    },
    // 切换栏目
    cutTab(index){
      this.tabLoading = true;
      this.tab = index;
      setTimeout(()=>{
        this.tabLoading = false
      },1000)
    },
    // 获取评价总数
    getCommentTotal(){
      good({
        limit: 1,
        page: 1,
        good_id:$nuxt.$route.params.id,
        sort:'-created_at'
      }).then(response => {
        this.commentTotal = response.total
      })
    },
    // 秒杀倒计时结束
    endTime(){
      this.$router.go(0)
    }
  }
}
