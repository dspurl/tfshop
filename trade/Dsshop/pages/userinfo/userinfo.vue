<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="setPortrait" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">头像</text>
			<view class="action">
				<view v-if="user.portrait" class="cu-avatar round" :style="'background-image:url('+user.portrait+');'"></view>
			</view>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @tap="showModal" data-target="DialogModal1" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<view class="action">
				{{user.nickname ? user.nickname : '未设置'}}
			</view>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">昵称</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<input class="input" v-model="user.nickname" placeholder="昵称" placeholder-class="placeholder" maxlength="60"/>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-red text-red" @tap="hideModal">取消</button>
						<button class="cu-btn bg-red margin-left" @tap="setUser(1)">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">手机号</text>
			<view class="action">
				{{user.cellphone}}
			</view>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/userinfo/email?email='+(user.email ? user.email : ''))" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">邮箱</text>
			<view class="action">
				{{user.email}}
			</view>
			<text class="cell-more yticon icon-you"></text>
		</view>
	</view>
</template>

<script>
	import User from '../../api/user';
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				user: {},
				modalName: null,
			};
		},
		onShow(){
			this.loginCheck()
			this.getUser()
		},
		methods:{
			...mapMutations(['loginCheck']),
			getUser(){
				const that = this
				User.detail(function(res){
					that.user = res
				})
			},
			setPortrait(){
				this.ChooseImage()
			},
			ChooseImage() {
				let that = this
				let uploadFile = ''
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						uni.uploadFile({
						  url: that.configURL.BaseURL + 'uploadPictures',
						  filePath: res.tempFilePaths[0],
						  name: 'file',
						  header: {
							'apply-secret': that.configURL.secret,
							'Authorization': 'Bearer ' + uni.getStorageSync('dsshopApplytoken')
						  },
						  formData: {
							type: 1,
							size: 1024 * 500
						  },
						  success(res) {
							User.edit({portrait:res.data},function(r){
								that.user.portrait = r
							})
						  },
						  fail(res) {
							that.$api.msg(res.message);
							return false
						  }
						})
					}
				});
			},
			navTo(url){
				uni.navigateTo({
					url
				})  
			},
			setUser(type){
				const that = this
				let data = {}
				if(type === 1){ // 昵称
					data = {
						nickname: this.user.nickname
					}
				}
				User.edit(data,function(res){
					that.hideModal()
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
