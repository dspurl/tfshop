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
        this.cartList = Object.values(response)
        this.store.set(process.env.CACHE_PR + 'CartList',response)
        this.cartOriginalList = response
        if(this.cartList.length>0){

          this.empty = false
        }else{
          this.empty = true
        }
        for(let k in this.cartList){
          if(this.cartList[k].good_sku){
            this.cartList[k].good_sku.skus.forEach(item=>{
              if(this.cartList[k].specification){
                this.cartList[k].specification+= item.v + ';'
              }else{
                this.cartList[k].specification = item.v + ';'
              }
            })
            this.cartList[k].specification = this.cartList[k].specification.substr(0,this.cartList[k].specification.length-1)
          }
          if(this.cartList[k].good.is_delete === 1 || this.cartList[k].good.is_show !== 1){
            this.cartList[k].invalid = true
          }
          if(this.cartList[k].invalid === true){ //失效的商品
            this.invalidGood.push(this.cartList[k])
          }
        }
        for(let k in this.cartList){
          if(this.cartList[k].invalid === true){ //失效的商品
            this.cartList.splice(k,1)
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
      if(this.cartList[index].good_sku_id){
        this.cartOriginalList[this.cartList[index].good_sku_id].number =  this.cartList[index].number
      }else{
        this.cartOriginalList['good_'+this.cartList[index].good_id].number =  this.cartList[index].number
      }
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
        if(this.invalidGood[index].good_sku_id){
          delete this.cartOriginalList[this.invalidGood[index].good_sku_id]
        }else{
          delete this.cartOriginalList['good_'+this.invalidGood[index].good_id]
        }
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList)
        this.invalidGood.splice(index, 1);
        this.getList();
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
        if(this.cartList[index].good_sku_id){
          delete this.cartOriginalList[this.cartList[index].good_sku_id]
        }else{
          delete this.cartOriginalList['good_'+this.cartList[index].good_id]
        }
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList)
        this.cartList.splice(index, 1);
        this.getList();
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
                delete this.cartOriginalList[item2.good_sku_id]
                this.cartList.splice(index, 1);
              }
            }else{
              if(item.good_id === item2.good_id){
                delete this.cartOriginalList['good_'+item2.good_id]
                this.cartList.splice(index, 1);
              }
            }
          })
        })
        if(Object.values(this.cartOriginalList).length > 0){
          this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
        }else{
          this.store.remove(process.env.CACHE_PR + 'CartList')
        }
        addShoppingCart(this.cartOriginalList)
      }).catch(() => {
      })
    },
  }
}
