import {detail} from '@/api/good'
import {create as collectCreate, destroy as collectDestroy, detail as getCollectDetail} from '@/api/collect'
import sku from '@/components/Sku'
import VueVideo from '@/components/VueVideo'
import 'video.js/dist/video-js.css'
import Comment from '@/pages/comment/list'
import {good} from '@/api/comment'
import coupon from '@/pages/coupon/components'
import {verifyPlugin} from '@/api/plugin'
export default {
  components: {
    sku,
    VueVideo,
    Comment,
    coupon
  },
  data() {
    return {
      tab: 1,
      tabLoading: false,
      goodDetail: {},
      specificationDefaultDisplay: {},
      resources_many: [],
      resources_many_img: [],
      collect: 0,
      poster: '',
      commentTotal: 0,
      isComment: false,
      isCoupon: false
    }
  },
  async asyncData (ctx) {
    try {
      const { params } = ctx;
      let [ goodDetailData, verifyPluginData ] = await Promise.all([
        detail(params.id),
        verifyPlugin(['coupon','comment']),
      ]);
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
        goodDetail: goodDetailData,
        resources_many: resources_many,
        resources_many_img: resources_many_img,
        poster: poster,
        isCoupon: verifyPluginData.coupon,
        isComment: verifyPluginData.comment,
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
    }
  }
}
