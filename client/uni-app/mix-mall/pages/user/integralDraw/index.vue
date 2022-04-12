<template>
  <view>
	  <view v-if="data">
	      <view class="main">
	  		<view class="top-box">
	  			<view class="bg" :style="{backgroundImage:`url(${require('./assets/top_bg.png')})`,backgroundSize: 'cover'}">
	  				<view class="name">{{data.name}}</view>
	  			</view>
	  		</view>
	        <view class="draw-box" :class="{failure: !data.is_hidden}">
	  		  <image class="decorate1" :src="require('./assets/decorate1.png')" mode="aspectFit"></image>
	  		  <image class="decorate2" :src="require('./assets/decorate2.png')" mode="aspectFit"></image>
	  		  <image class="decorate3" :src="require('./assets/decorate3.png')" mode="aspectFit"></image>
	  		  <image class="decorate4" :src="require('./assets/decorate4.png')" mode="aspectFit"></image>
	  		  <view class="draw">
				<ds-lucky-wheel v-if="data.type === 1" ref="myLuckyWheel" :data="data"/>
				<ds-lucky-grid v-else-if="data.type === 2" ref="myLuckyGrid" :data="data"/>
				<ds-slot-machine v-else-if="data.type === 3" ref="mySlotMachine" :data="data"/>
	  		  </view>
	        </view>
	        <view class="popup" v-if="!data.is_hidden"></view>
	      </view>
	      <view class="explain-box">
	        <view class="time">活动时间：{{ data.start_time }} - {{ data.end_time }}</view>
	        <view class="explain">{{data.explain}}</view>
	      </view>
	  	  <view class="padding"></view>
	    </view>
	    <view v-else>
	      <view style="text-align: center;">~没有找到抽奖活动</view>
	    </view>
	  </view>
  </view>
</template>
<style lang='scss' scoped>
@import "./scss/index";
</style>
<script>
  import {detail} from '@/api/integralDraw'
  import {getList} from '@/api/integralDrawLog'
  import dsLuckyWheel from './components/dsLuckyWheel'
  import dsLuckyGrid from './components/dsLuckyGrid'
  import dsSlotMachine from './components/dsSlotMachine'
  export default {
    components: {
	 dsLuckyWheel,
	 dsLuckyGrid,
	 dsSlotMachine
	},
    data () {
      return {
		tableLoading: false,
		data: null,
		integralDrawLog: [],
		id: 0,
        blocks: [{ padding: '13px', background: '#617df2' }],
        prizes: [
          { fonts: [{ text: '0', top: '10%' }], background: '#e9e8fe' },
          { fonts: [{ text: '1', top: '10%' }], background: '#b8c5f2' },
          { fonts: [{ text: '2', top: '10%' }], background: '#e9e8fe' },
          { fonts: [{ text: '3', top: '10%' }], background: '#b8c5f2' },
          { fonts: [{ text: '4', top: '10%' }], background: '#e9e8fe' },
          { fonts: [{ text: '5', top: '10%' }], background: '#b8c5f2' },
        ],
        buttons: [
          { radius: '50px', background: '#617df2' },
          { radius: '45px', background: '#afc8ff' },
          {
            radius: '40px', background: '#869cfa',
            pointer: true,
            fonts: [{ text: '开始\n抽奖', top: '-20px' }]
          },
        ],
      }
    },
	onLoad(option) {
		if (!option.id) {
			this.$api.msg('参数有误');
			return false;
		}
		this.id = option.id;
	},
	mounted() {
	  this.getDetail()
	},
    methods: {
		getDetail() {
			const that = this
			if (!this.id) {
				
				return false
			}
			detail(this.id,{},function(res){
				that.data = res
			})
		},
      // 点击抽奖按钮触发回调
      startCallBack () {
        // 先开始旋转
        this.$refs.myLucky.play()
        // 使用定时器来模拟请求接口
        setTimeout(() => {
          // 假设后端返回的中奖索引是0
          const index = 0
          // 调用stop停止旋转并传递中奖索引
          this.$refs.myLucky.stop(index)
        }, 3000)
      },
      // 抽奖结束触发回调
      endCallBack (prize) {
        // 奖品详情
        console.log(prize)
      }
    }
  }
</script>