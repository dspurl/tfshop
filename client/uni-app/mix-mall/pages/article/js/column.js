import {getList} from '@/api/column'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
export default {
	components: {
		uniLoadMore
	},
	data() {
		return {
			data: [],
			page:1,
			loadingType: 'more'
		};
	},
	onLoad(options){
		this.loadData()
	},
	methods: {
		//获取列表
		loadData(type){
			const that = this
			getList({
				limit: 8,
				page: this.page
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
		goNavigator(item){
			if(item.is_list === 1){
				uni.navigateTo({
					url: './index?id='+item.id+'&name='+item.name
				})
			}else{
				uni.navigateTo({
					url: './detail?list=1&id='+item.id
				})
			}

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
