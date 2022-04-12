<template>
	<view>
		<view class="cu-modal bottom-modal" :class="modalShow?'show':''" @click="hideModal"  @touchmove.stop.prevent="stopPrevent">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action"></view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl bg-white text-left" @click.stop="stopPrevent">
					<view>领券</view>
					<scroll-view scroll-y="true" class="specification">
						<coolc-coupon @getCoupon="getCoupon" v-for="(item, index) in getLists" :key="index" v-bind:item="item" theme="#ff6c00" color="#ffffff" solid="#ff6c00"></coolc-coupon>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import coolcCoupon from './coolc-coupon.vue';
import {create} from '@/api/coupon';
export default{
	name: 'Coupon',
	props: {
		getList: {
			type: Array,
			default: function(){
				return [];
			}
		},
		show: {
			type: Boolean,
			default: false
		}
	},
	components: {
		coolcCoupon
	},
	data() {
		return {
			getLists:this.getList,
			modalShow: this.show,
		};
	},
	watch: {
		getList(newVal) {
			this.$emit('getList', newVal)
			this.getLists = this.getList			
		},
		show(newVal) {
			this.modalShow = this.show
		},
		modalShow(newVal){
			this.$emit('changeShow', newVal)
		}
	},
	methods:{
		hideModal(){
			this.modalShow = false
		},
		getCoupon(item){
			const that = this
			create(item,function(res){
				that.getLists.forEach((i,index)=>{
					if(i.id === item.id){
						that.getLists[index].state = '2'
					}
				})
			})
		},
		stopPrevent() {},
	},

}
</script>

<style lang="scss">
	.specification{
		max-height: 700upx;
		overflow-y:auto;
	}
	/deep/ .get-btn{
		right:10upx !important;
	}
</style>
