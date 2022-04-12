import {success, authorization} from '@/api/sweepLogin'
import User from '@/api/user';
import {mapMutations, mapState} from 'vuex';
import { urlToObj } from 'utils'
export default {
	data() {
		return {
			user: {},
			uuid: '',
			state: 1
		};
	},
	onLoad(options){
		const q = decodeURIComponent(options.q)
		const url = urlToObj(q)
		this.uuid = url.uuid
		
	},
	onShow(){
		if(!this.uuid){
			this.$api.msg(`缺少参数`);
			return false
		}
		this.loginCheck()
		if(this.hasLogin){
			this.getUser()
			this.setSuccess()
		}
		
	},
	methods: {
		...mapMutations(['loginCheck']),
		...mapState(['hasLogin','userInfo']),
		getUser(){
			const that = this
			User.detail(function(res){
				that.user = res
			})
		},
		setSuccess(){
			const that = this
			success({
				uuid: this.uuid
			},function(res){
				this.state = res.state
			})
		},
		setAuthorization(){
			const that = this
			authorization({
				uuid: this.uuid
			},function(res){
				that.$api.msg(`授权成功`);
				uni.exitMiniProgram()
			})
			
		}
	}
}
