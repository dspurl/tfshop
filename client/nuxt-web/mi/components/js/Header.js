import { addShoppingCart, synchronizationInventory } from '@/api/goodIndent'
export default {
  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");
      if(flag.test(value)){
        return callback(new Error('不允许输入非法字符'));
      }else{
        callback();
      }
    };
    return {
      navList: [
        { name: '首页', path: '/' },
        { name: '全部分类', path: '/category/list' },
      ],
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
      user:{},
      rules: {
        keyword: [
          { validator: validateRemark, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.setNavActive(val.path)
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
    this.searchRuleForm.keyword = $nuxt.$store.state.setSearchKeyword
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
      for (let i=0;i<this.navList.length;i++)
      {
        if(this.navList[i].path.split('\/')[1]  === path.split('\/')[1]){
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
        this.user = $nuxt.store.get(process.env.CACHE_PR + 'UserInfo')
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
          $nuxt.$store.commit('setSearchKeyword', this.searchRuleForm.keyword)
          this.$router.push({
            path: `/product/list`,
            query: { title: this.searchRuleForm.keyword }
          })
        }
      });
    }
  }
}
