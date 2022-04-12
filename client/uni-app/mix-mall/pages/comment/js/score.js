import {detail,create} from '@/api/comment'
import {mapMutations} from 'vuex'
import UniRate from '../components/uni-rate'
export default {
	components: {
		UniRate
	},
	data() {
		return {
			imgList: [],
			scoreName: ['','差','较差','一般','好','很好'],
			data: [],
			commodity: [],
			id: ''
		}
	},
	
	onLoad: function(options) {
		if(!options.id){
			this.$api.msg('参数有误')
		}else{
			this.id = options.id
		}
		this.loginCheck()
		this.loadData()
	},
	methods: {
		...mapMutations(['loginCheck']),
		// 获取商品列表
		async loadData() {
			const that = this
			detail(this.id,function(res){
				that.commodity = res
				res.forEach((item,index)=>{
					that.data[index]={
						score:0,
						details: null,
						resources:[],
						anonymity: 0,
						id:item.id
					}
				})
			})
		},
		// 评价内容
		textareaAInput(e,index){
			this.data[index].details=e.detail.value
			
		},
		// 设置星级评分
		setScore(e){
			this.$forceUpdate()
		},
		ChooseImage(index) {
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
						size: 1024 * 1024 * 2,
						specification: [80, 150]
					  },
					  success(res) {
						that.data[index].resources.push(res.data)
						that.$forceUpdate()
					  },
					  fail(res) {
						that.$api.msg(res.message);
						return false
					  }
					})
				}
			});
		},
		// 预览图片
		ViewImage(ind,index) {
			uni.previewImage({
				urls: this.data[ind].resources,
				current: this.data[ind].resources[index].url
			});
		},
		// 删除图片
		DelImg(ind,index) {
			uni.showModal({
				content: '确定要删除该图片？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.data[ind].resources.splice(index, 1)
						this.$forceUpdate()
					}
				}
			})
		},
		// 是否匿名
		setAnonymity(ind){
			this.data[ind].anonymity = this.data[ind].anonymity ? 0 : 1
			this.$forceUpdate()
		},
		// 提交
		addComment(){
			const that = this
			let data = this.data
			for (const [index,item] of data.entries()){
				if(!item.score){
					this.$api.msg('您还有未选择的星级评分');
					return;
				}
				if(!item.details){
					this.$api.msg('您还有未填写的评价内容');
					return;
				}
			}
			create(this.id,data,function(res){
				that.$api.msg(`评价成功`);
				setTimeout(()=>{
						that.$api.prePage().refreshOderList();
						uni.navigateBack();
				}, 800)
			})
		}
	},
	
}