import {getList} from '@/api/seckill'
import moment from 'moment'
export default {
	data() {
		return {
			scrollLeft: 0,
			TabCur: 0,
			times: [],
			list: [],
			time: '',
			page: 1,
			loading: false,
			loadingType: 'more',
		};
	},
	onLoad(options){
		let that = this;
		this.setNav()
		setTimeout(function() {
			that.loading = true
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
		// 设置导航
		setNav(){
			let time = moment().format('YYYY-MM-DD HH:00:00')
			if(moment().format('HH')%2 !== 0){
				time = moment().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00')
			}
			this.time = time
			this.times = [{
				label: `${moment(time, "YYYY-MM-DD HH:00:00").format('H')}:00`,
				value: moment(time, "YYYY-MM-DD HH:00:00").format('YYYY-MM-DD HH:00:00'),
				active: true
				}, {
				label: `${moment(time, "YYYY-MM-DD HH:00:00").add(2, 'hour').format('H')}:00`,
				value: moment(time, "YYYY-MM-DD HH:00:00").add(2, 'hour').format('YYYY-MM-DD HH:00:00'),
				active: false
				}, {
				label: `${moment(time, "YYYY-MM-DD HH:00:00").add(4, 'hour').format('H')}:00`,
				value: moment(time, "YYYY-MM-DD HH:00:00").add(4, 'hour').format('YYYY-MM-DD HH:00:00'),
				active: false
				}, {
				label: `${moment(time, "YYYY-MM-DD HH:00:00").add(6, 'hour').format('H')}:00`,
				value: moment(time, "YYYY-MM-DD HH:00:00").add(6, 'hour').format('YYYY-MM-DD HH:00:00'),
				active: false
				}, {
				label: `${moment(time, "YYYY-MM-DD HH:00:00").add(8, 'hour').format('H')}:00`,
				value: moment(time, "YYYY-MM-DD HH:00:00").add(8, 'hour').format('YYYY-MM-DD HH:00:00'),
				active: false
			}]
			this.loadData();
		},
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
				sort: 'id',
				time: this.time,
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
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			this.time = this.times[this.TabCur].value
			this.loadData('refresh');
		}
	}
}
