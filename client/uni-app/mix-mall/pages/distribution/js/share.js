import _app from '../components/QS-SharePoster/app.js';
import User from '@/api/user';
import {
	getSharePoster
} from '../components/QS-SharePoster/QS-SharePoster.js';
export default {
	data(){
		return {
			poster: {},
			windowHeight: '600',
			screenHeight: '500',
			qrcode: '',
			canvasImage: {},
			qrShow: false,
			canvasId: 'default_PosterCanvasId',
			uuid: ''
		}
	},
	onLoad() {
		const that = this
		uni.getSystemInfo({
			success: function (res) {
				that.windowHeight = res.windowHeight
				that.screenHeight = res.screenHeight
			}
		})
		this.getUser()
	},
	methods:{
		async shareFc() {
			try {
				const d = await getSharePoster({
					_this: this, //若在组件中使用 必传
					type: 'testShareType',
					backgroundImage: '/static/temp/ad-splash.jpg', //背景图片路径
					posterCanvasId: this.canvasId,	//canvasId
					delayTimeScale: 20, //延时系数
					drawArray: ({
						bgObj,
						type,
						bgScale
					}) => {
						const dx = bgObj.width * 0.3;
						const fontSize = bgObj.width * 0.045;
						const lineHeight = bgObj.height * 0.04;
						const url = this.configURL.DomainName +'/h5/#/pages/public/register?uuid=' + this.uuid
						//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
						return new Promise((rs, rj) => {
							rs([{
								type: 'roundFillRect',
								backgroundColor: '#ffffff',
								dx: bgObj.width*0.05-10,
								dy: bgObj.height - bgObj.width*0.25-10,
								width: bgObj.width * 0.2 +20,
								height:bgObj.width * 0.2 +20
							},{
									type: 'qrcode',
									text: url,
									size: bgObj.width * 0.2,
									dx: bgObj.width*0.05,
									dy: bgObj.height - bgObj.width*0.25,
									background: '#ffffff'
								}
							]);
						})
					},
					setCanvasWH: ({
						bgObj,
						type,
						bgScale
					}) => { // 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				this.poster.finalPath = d.poster.tempFilePath;
				this.qrShow = true;
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
			}
		},
		clipboard() {
			const url = this.configURL.DomainName +'/h5/#/pages/public/register?uuid=' + this.uuid
			// #ifndef H5
			const that = this
			uni.setClipboardData({
			    data: url,
			    success: function () {
					that.$api.msg('分享链接已复制，快去分享吧~')
			    }
			});
			// #endif
			// #ifdef H5
			let result
			let textarea = document.createElement("textarea")
			textarea.value = url
			textarea.readOnly = "readOnly"
			document.body.appendChild(textarea)
			textarea.select()
			textarea.setSelectionRange(0, url.length)
			this.$api.msg('分享链接已复制，快去分享吧~')
			result = document.execCommand("copy")
			textarea.remove()
			// #endif
		},
		getUser(){
			const that = this
			User.detail(function(res){
				that.uuid = res.uuid
			})
		},
		hideQr() {
			this.qrShow = false;
		},
		// 预览图片
		previewImage(){
			uni.previewImage({
				urls: [this.poster.finalPath],
				longPressActions: {
					itemList: ['发送给朋友', '保存图片'],
					success: function(data) {
						
					},
					fail: function(err) {
						console.log('err',err)
					}
				}
			})
		},
		toJSON(){
			
		}
	}
}