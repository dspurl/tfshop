import {getUserList} from '@/api/coupon'
export default {
  name: 'CouponUse',
  props: {
    money: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      list: [],
      total: 0,
      couponMoney: 0,
      couponIndex: null,
      visible: false,
      listQuery: {
        limit: 100,
        money: 0,
        index: 1,
        page: 1,
        sort: '-created_at'
      }
    }
  },
  watch: {
    money(newVal) {
      this.listQuery.money = newVal
      this.getList()
    }
  },
  methods: {
    async getList(){
      this.loading = true;
      await Promise.all([
        getUserList(this.listQuery)
      ]).then(([data]) => {
        data.data.forEach((item,index)=>{
          switch(item.coupon.type){
            case 1:
              item.cost = item.coupon.cost/100
              if(item.cost > this.couponMoney){
                this.couponMoney = item.cost
                this.couponIndex = index
              }
              break
            case 2:
              item.cost = item.coupon.cost/100
              if(item.cost > this.couponMoney){
                this.couponMoney = item.cost
                this.couponIndex = index
              }

              break
            case 3:
              item.cost = this.listQuery.money * item.coupon.cost/10000
              if(item.cost > this.couponMoney){
                this.couponMoney = item.cost
                this.couponIndex = index
              }
              break
          }
          if(item.coupon.sill){
            item.sill = '满' + (item.coupon.sill/100) + '可用'
          }else{
            item.sill = '无门槛'
          }
        })
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
        this.$emit('select', this.list[this.couponIndex])
      }).catch((error) => {
        this.loading = false;
      })
    },
    // 选择优惠券
    select(item, index){
      this.couponIndex = index
      this.visible = false
      this.$emit('select', item)
    }
  }
}
