import {detail, pv} from '@/api/article'
import {detail as columnDetail, pv as columnPv} from '@/api/column'
import uParse from '@/components/gaoyia-parse/parse.vue'
export default {
	components: {
		uParse
	},
	data() {
		return {
			data: {},
			id: 0,
			list: 0
		};
	},
	onLoad(options){
		if(options.id && options.list){
			this.id = options.id
			this.list = options.list
			this.loadData()
			this.setPv()
		}
	},
	methods: {
		//获取列表
		loadData(type){
			const that = this
			if(this.list === '1'){	//栏目详情
				columnDetail(that.id,{},function(res){
					that.data = res
					uni.setNavigationBarTitle({
						title: res.name
					})
				})
			}else{
				detail(that.id,{},function(res){
					that.data = res
					uni.setNavigationBarTitle({
						title: res.name
					})
				})
			}
		},
		// 增加访问量
		setPv(){
			const that = this
			if(this.list === '1'){	//栏目
				columnPv(that.id,{},function(res){})
			}else{
				pv(that.id,{},function(res){})
			}
		}
	}
}
