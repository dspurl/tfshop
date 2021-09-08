import {synchronizationInventory, addShoppingCart} from '@/api/goodIndent'
export default {
  layout: 'cart',
  head () {
    return {
      title: '我的购物车' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    return {
      loading: true,
      cartList: [],
      cartOriginalList: [],
      invalidGood: [],
      total: 0,
      allChecked: true,
      empty: true,
      multipleSelection: []
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '我的购物车');
    if($nuxt.$store.state.hasLogin){
      this.getList()
    }
  },
  methods: {
    async getList(){
      this.loading = true;
      this.cartList = []
      this.invalidGood = []
      await synchronizationInventory().then(response => {
        this.store.set(process.env.CACHE_PR + 'CartList',response)
        this.cartOriginalList = response
        if(response.length>0){
          this.empty = false
        }else{
          this.empty = true
        }
        for(let k in response){
          if(response[k].good_sku){
            response[k].specification = ''
            response[k].good_sku.skus.forEach(item=>{
              if(response[k].specification){
                response[k].specification+= item.v + ';'
              }else{
                response[k].specification = item.v + ';'
              }
            })
            response[k].specification = response[k].specification.substr(0,response[k].specification.length-1)
          }
          if(response[k].good.is_delete === 1 || response[k].good.is_show !== 1){
            response[k].invalid = true
          }
          if(response[k].invalid === true){ //失效的商品
            this.invalidGood.push({
              ...response[k],
              index: k
            })
          }else{
            this.cartList.push({
              ...response[k],
              index: k
            })
          }
        }
        this.$nextTick(()=>{
          if(this.empty === false){
            this.handleCheckAllChange()
          }
        })
        this.loading = false;
      }).catch(() => {
        this.loading = false
      })

    },
    calcTotal(){
      let list = this.multipleSelection;
      let total = 0;
      list.forEach(item=>{
        total += item.price * item.number;
      })
      this.total = Number(total.toFixed(2));
    },
    handleSelectionChange(val){
      this.multipleSelection = val
      this.calcTotal();
    },
    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection()
      this.calcTotal();
    },
    //创建订单
    createOrder(){
      if(this.multipleSelection.length <=0){
        this.$message({
          message: '请选择商品',
          type: 'error'
        });
      }else{
        this.store.set(process.env.CACHE_PR + 'OrderList',this.multipleSelection)
        $nuxt.$router.push('/indent/create');
      }
    },
    //修改数量
    numberChange(index){
      this.cartOriginalList[index].number =  this.cartList[index].number
      this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
      addShoppingCart(this.cartOriginalList)
      this.calcTotal();
    },
    //删除失效的商品
    deleteInvalidGood(index){
      this.$confirm('是否移除该商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cartOriginalList.splice(this.invalidGood[index].index, 1)
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList).then(() => {
          this.getList();
        })
        this.invalidGood.splice(index, 1);
      }).catch(() => {
      })
    },
    //删除
    deleteCartItem(index){
      this.$confirm('是否移除该商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cartOriginalList.splice(this.cartList[index].index, 1)
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList).then(() => {
          this.getList();
        })
        this.cartList.splice(index, 1);
      }).catch(() => {
      })
    },
    //删除选中的商品
    clearCart(){
      this.$confirm('是否移除所选商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item=>{
          this.cartList.forEach((item2,index)=>{
            if(item.good_sku_id){
              if(item.good_sku_id === item2.good_sku_id){
                delete this.cartOriginalList[item2.index]
                this.cartList.splice(index, 1);
              }
            }else{
              if(item.good_id === item2.good_id){
                delete this.cartOriginalList[item2.index]
                this.cartList.splice(index, 1);
              }
            }
          })
        })
        this.cartOriginalList = this.cartOriginalList.filter((res) => {
          return res;
        })
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList).then(() => {
          this.getList();
        })
      }).catch(() => {
      })
    },
  }
}
