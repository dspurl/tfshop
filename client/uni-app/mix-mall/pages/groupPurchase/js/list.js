import {getList} from '@/api/groupPurchase'
export default {
	data() {
		return {
			scrollLeft: 0,
			TabCur: 0,
			list: [],
			page: 1,
			loading: false,
			loadingType: 'more',
		};
	},
	onLoad(options){
		let that = this;
		setTimeout(function() {
			that.loading = true
			that.loadData();
		}, 500)
	},
	//下拉刷新
	onPullDownRefresh(){
		this.loadData('refresh');
	},
	//加载更多
	onReachBottom(){
		this.loadData();
	},
	methods: {
		async loadData(type='add', loading) {
			// 下拉刷新
			if(type === 'refresh'){
				this.page = 1
				this.list = [];
			}
			//没有更多直接返回
			if(type === 'add'){
				if(this.loadingType === 'nomore'){
					return;
				}
				this.loadingType = 'loading';
			}else{
				this.loadingType = 'more'
			}
			
			const that =this
			await getList({
				limit: 6,
				state: 1,
				page: this.page
			},function(res){
				that.list = that.list.concat(res.data)
				if (res.last_page > that.page){
					that.page ++
					that.loadingType  = 'more'
				} else {
					that.loadingType  = 'nomore'
				}
			})
			if(type === 'refresh'){
				that.loading = false
				setTimeout(function() {
					that.loading = true
				}, 500)
				if(loading == 1){
					uni.hideLoading()
				}else{
					uni.stopPullDownRefresh();
				}
			}
		}
	}
}
