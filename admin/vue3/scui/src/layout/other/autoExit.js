export default {
	render() {

	},
	data() {
		return {
			logoutCount: this.$TOOL.data.get('AUTO_EXIT')
		}
	},
	mounted() {
		if(this.logoutCount){
			this.setNewAutoExitTime()
			document.onclick = () => {
				this.setNewAutoExitTime()
			}
			document.onmousemove = () => {
				this.setNewAutoExitTime()
			}
			document.onkeydown = () => {
				this.setNewAutoExitTime()
			}
			document.onscroll = () => {
				this.setNewAutoExitTime()
			}
			window.autoExitTimer = window.setInterval(this.autoExitfun, 1000)
		}
	},
	unmounted() {
		if(this.logoutCount){
			clearInterval(window.autoExitTimer)
			window.autoExitTimer = null
		}
	},
	methods: {
		setNewAutoExitTime(){
			window.autoExitTime = new Date().getTime()
		},
		autoExitfun(){
			if(new Date().getTime() - window.autoExitTime > this.logoutCount * 60 * 1000){
				clearInterval(window.autoExitTimer)
				window.autoExitTimer = null
				this.$router.replace({path: '/login'})
				this.$alert("用户长时间无操作，为保证账户安全，系统已自动登出。", "提示", {
					type: 'warning',
					center: true,
					roundButton: true
				})
			}
		}
	}
}
