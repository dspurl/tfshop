import {getList} from '@/api/article'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
export default {
	components: {
		uniLoadMore
	},
	data() {
		return {
			data: [],
			id: 0,
			page:1,
			loadingType: 'more'
		};
	},
	onLoad(options){
		if(options.id){
			this.id = options.id
			uni.setNavigationBarTitle({
				title: options.name
			})
			this.loadData()
		}
	},
	methods: {
		//获取列表
		loadData(type){
			const that = this
			getList(that.id,{
				limit: 8,
				page: this.page
			},function(res){
				that.data = that.data.concat(res.paginate.data)
				if (res.paginate.last_page > that.page){
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
			uni.navigateTo({
				url: './detail?list=0&id='+item.id
			})
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
