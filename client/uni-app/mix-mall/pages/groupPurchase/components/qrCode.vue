<template>
	<view class="cu-modal" :class="modalShow?'show':''" @click="hideModal"  @touchmove.stop.prevent="stopPrevent">
		<view class="cu-dialog">
			<view class="cu-bar bg-white">
				<view class="action"></view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="padding-xl bg-white text-center" @click.stop="stopPrevent">
				<view class="image">
					<image @click="previewImage" v-if="img" :src="img" mode="widthFix" lazy-load></image>
					<view class="">点击二维码进行分享</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {code} from '@/api/groupPurchase'
export default{
	name: 'Code',
	props: {
		sid: {
			type: Number,
			default: 0
		},
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			modalShow: this.show,
			img: ''
		};
	},
	watch: {
		show(newVal) {
			this.modalShow = this.show
			this.getCode()
		},
		modalShow(newVal){
			this.$emit('changeShow', newVal)
		}
	},
	methods: {
		getCode(){
			const that = this
			code({
				id: that.sid
			},function(res){
				that.img = res
			})
		},
		hideModal(){
			this.modalShow = false
		},
		stopPrevent() {},
		previewImage(){
			uni.previewImage({
				urls: [this.img],
				longPressActions: {
					success: function(data) {},
					fail: function(err) {}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
	.image{
		width: 300rpx;
		margin: 0 auto;
	}
</style>