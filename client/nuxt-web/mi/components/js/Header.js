import { addShoppingCart, synchronizationInventory } from '@/api/goodIndent'
import {detail} from '@/api/user'
export default {
  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");
      if(flag.test(value)){
        return callback(new Error(this.$t('header.top.validate_remark')));
      }else{
        callback();
      }
    };
    return {
      shoppingCart: [],
      cartOriginalList: [],
      cartLoading: false,
      shoppingTotal: 0,
      navActive: -1,
      searchRuleForm: {
        keyword: ''
      },
      cartActive: false,
      userActive: false,
      user:{
        cellphone: ''
      },
      rules: {
        keyword: [
          { validator: validateRemark, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    },
    navList () {
      return [
        { name: this.$t('header.top.nav_list.home'), path: '/' },
        { name: this.$t('header.top.nav_list.all_classifications'), path: '/category/list' },
      ]
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.setNavActive(val.path)
        this.searchRuleForm.keyword = val.query.title ? val.query.title : ''
      },
      deep: true
    }
  },
  mounted() {
    this.setNavActive($nuxt.$route.path)
    this.userInfo()
    if(this.$store.state.hasLogin) {
      this.getShoppingCart()
    }
  },
  methods: {
    // 获取购物车
    getShoppingCart(){
      this.cartLoading = true
      let cartList = this.store.get(process.env.CACHE_PR + 'CartList') ? Object.values(this.store.get(process.env.CACHE_PR + 'CartList')) : [];
      let total = 0;
      synchronizationInventory().then(response => {
        this.cartLoading = false;
        this.cartOriginalList = response
        cartList = Object.values(response)
        for(const k in cartList){
          cartList[k].checked = true
          cartList[k].loaded = 'loaded'
          if(cartList[k].good_sku){
            cartList[k].good_sku.skus.forEach(item=>{
              if(cartList[k].specification){
                cartList[k].specification+= item.v + ';'
              }else{
                cartList[k].specification = item.v + ';'
              }

            })
            cartList[k].specification = cartList[k].specification.substr(0,cartList[k].specification.length-1)
          }
          if(cartList[k].good.is_delete === 1 || cartList[k].good.is_show !== 1){
            cartList[k].invalid = true
          }
          total += cartList[k].price * cartList[k].number;
        }
        this.shoppingCart = cartList;
        $nuxt.$store.commit('setShoppingCartNumber', Object.values(cartList).length)
        this.shoppingTotal = Number(total.toFixed(2));
      }).catch(() => {
        this.cartLoading = false
      })
    },
    setNavActive(path){
      this.navActive = -1
      for (let i=0;i<this.navList.length;i++)
      {
        if(this.navList[i].path.split('\/')[1]  === path.split('\/')[1] || this.$store.state.lang !== 'zh' && this.navList[i].path.split('\/')[1]  === path.split('\/')[2]){
          this.navActive = i
          break
        }
      }
    },
    userMenu(){
      this.userActive = true
    },
    userMenuOut(){
      this.userActive = false
    },
    userCart(){
      this.cartActive = true
      if(this.$store.state.hasLogin){
        this.getShoppingCart()
      }
    },
    userCartOut(){
      this.cartActive = false
    },
    goLogin(){
      $nuxt.store.set('route', { path:$nuxt.$route.path, query:$nuxt.$route.query })
      $nuxt.$router.replace('/pass/login')
    },
    logout(){
      $nuxt.$store.commit('logout')
      $nuxt.$router.go(0)
    },
    submitForm(){

    },
    userInfo(){
      if($nuxt.$store.state.hasLogin){
        const userInfo = $nuxt.store.get(process.env.CACHE_PR + 'UserInfo')
        if(userInfo){
          this.user = userInfo
        }else{
          detail().then(response => {
            $nuxt.store.set(process.env.CACHE_PR + 'UserInfo', response)
          })
        }
      }
    },
    // 删除商品
    deleteCart(index){
      if(this.shoppingCart[index].good_sku_id){
        delete this.cartOriginalList[this.shoppingCart[index].good_sku_id]
      }else{
        delete this.cartOriginalList['good_'+this.shoppingCart[index].good_id]
      }

      this.shoppingCart.splice(index, 1)
      this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
      addShoppingCart(this.cartOriginalList)
      this.getShoppingCart()
    },
    // 搜索
    search(){
      this.$refs['searchRuleForm'].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: `/product/list`,
            query: { title: this.searchRuleForm.keyword }
          })
        }
      });
    },
    handleChangeLang(lang) {
      this.$store.commit("setLang", lang);
      $nuxt.$i18n.setLocale(lang)
    }
  }
}
