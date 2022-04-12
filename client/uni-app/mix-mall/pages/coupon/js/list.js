import {getUserList} from '@/api/coupon'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from "@/components/empty";
import coolcCoupon from '../components/coolc-coupon.vue';
export default {
	components: {
		uniLoadMore,
		empty,
		coolcCoupon
	},
	data() {
		return {
			tabCurrentIndex: 0,
			navList: [{
					state: 0,
					text: '全部',
					loadingType: 'more',
					orderList: []
				},
				{
					state: 1,
					text: '未使用',
					loadingType: 'more',
					orderList: []
				},
				{
					state: 2,
					text: '已使用',
					loadingType: 'more',
					orderList: []
				},
				{
					state: 3,
					text: '已失效',
					loadingType: 'more',
					orderList: []
				}
			],
			page:1,
		};
	},
	onLoad(options){
		this.loadData();
	},
	methods: {
		//列表
		async loadData(source,search){
			let index = this.tabCurrentIndex;
			let navItem = this.navList[index];
			let state = navItem.state;
			if(source === 'tabChange' && navItem.loaded === true){
				return;
			}
			
			if(navItem.loadingType === 'loading'){
				//防止重复加载
				return;
			}
			if(navItem.loadingType === 'noMore'){
				//无更多数据时跳出
				return;
			}
			navItem.loadingType = 'loading';
			let userCouponList = []
			let that =this
			await getUserList({
				limit: 8,
				page: this.page,
				index: index					
			},function(res){
				userCouponList = res.data
				if (res.last_page > that.page){
					that.page ++
					//判断是否还有数据， 有改为 more， 没有改为noMore
					that.$set(navItem, 'loadingType', 'more');
				} else {
					that.$set(navItem, 'loadingType', 'noMore');
				}
				userCouponList.forEach(item=>{
					let data = {
						id: item.coupon.id,
						money: item.coupon.cost/100,
						title: item.coupon.explain,
						type: item.coupon.type,
						url: '/pages/index/index',
						end_time: item.failure_time ? item.failure_time.split(' ')[0].replace(/-/g,".") : item.coupon.endtime.split(' ')[0].replace(/-/g,"."),
					}
					if(item.state === 1){
						data.state = '2'
					} else if(item.state === 2){
						data.state = '3'
					}else{
						data.state = '1'
					}
					navItem.orderList.push(data);
				})
				//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				that.$set(navItem, 'loaded', true);
			})
			
		}, 
		
		//swiper 切换
		changeTab(e){
			this.tabCurrentIndex = e.target.current;
			this.loadData('tabChange');
		},
		//顶部tab点击
		tabClick(index){
			this.tabCurrentIndex = index
			this.page = 1
		}
	}
}
