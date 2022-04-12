import {good} from '@/api/comment'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
export default {
	components: {
		uniLoadMore
	},
	data() {
		return {
			data: [],
			page:1,
			id: 0,
			loadingType: 'more'
		}
	},
	onLoad: function(options) {
		let id = options.id;
		if (id) {
			this.id = id
			this.loadData();
		}
	},
	methods: {
		//获取列表
		loadData(type){
			const that = this
			good({
				limit: 8,
				page: this.page,
				good_id:that.id,
				sort:'-created_at'
			},function(res){
				that.data = that.data.concat(res.data)
				if (res.last_page > that.page){
					that.page ++
					//判断是否还有数据， 有改为 more， 没有改为noMore
					that.loadingType = 'more'
				} else {
					that.loadingType = 'noMore'
				}
				if(type === 'pull'){
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000)
				}
			})
		},
		// 预览图片
		ViewImage(ind,index) {
			console.log(this.data[index].comment.resources_many[ind].img)
			uni.previewImage({
				urls: this.data[index].comment.resources_many.map((ite)=>{return ite.img}),
				current: this.data[index].comment.resources_many[ind].img
			});
		},
		onPullDownRefresh() {
			this.data = []
			this.page = 1
			this.loadData('pull')
		},
		onReachBottom(){
			if(this.loadingType !== 'noMore'){
				this.loadData()
			}
		}
	}
}