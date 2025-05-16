<template>
	<div class="sc-search">
		<el-input ref="input" v-model="input" placeholder="搜索" size="large" clearable prefix-icon="el-icon-search" :trigger-on-focus="false" @input="inputChange"/>
		<div class="sc-search-history" v-if="history.length>0">
			<el-tag closable effect="dark" type="info" v-for="(item, index) in history" :key="item" @click="historyClick(item)" @close="historyClose(index)">{{item}}</el-tag>
		</div>
		<div class="sc-search-result">
			<div class="sc-search-no-result" v-if="result.length<=0">暂无搜索结果</div>
			<ul v-else>
				<el-scrollbar max-height="366px">
					<li v-for="item in result" :key="item.path" @click="to(item)">
						<el-icon><component :is="item.icon || 'el-icon-menu'" /></el-icon>
						<span class="title">{{ item.breadcrumb }}</span>
					</li>
				</el-scrollbar>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				input: "",
				menu: [],
				result: [],
				history: []
			}
		},
		mounted() {
			var searchHistory = this.$TOOL.data.get("SEARCH_HISTORY") || []
			this.history = searchHistory
			var menuTree = this.$TOOL.data.get("MENU")
			this.filterMenu(menuTree)
			this.$refs.input.focus()
		},
		methods: {
			inputChange(value){
				if(value){
					this.result = this.menuFilter(value)
				}else{
					this.result = []
				}
			},
			filterMenu(map){
				map.forEach(item => {
					if(item.meta.hidden || item.meta.type=="button"){
						return false
					}
					if(item.meta.type=='iframe'){
						item.path = `/i/${item.name}`
					}
					if(item.children&&item.children.length > 0&&!item.component){
						this.filterMenu(item.children)
					}else{
						this.menu.push(item)
					}
				})
			},
			menuFilter(queryString){
				var res = []
				//过滤菜单树
				var filterMenu = this.menu.filter((item) => {
					if((item.meta.title).toLowerCase().indexOf(queryString.toLowerCase()) >= 0){
						return true
					}
					if((item.name).toLowerCase().indexOf(queryString.toLowerCase()) >= 0){
						return true
					}
				})
				//匹配系统路由
				var router = this.$router.getRoutes()
				var filterRouter= filterMenu.map((m) => {
					if(m.meta.type == "link"){
						return router.find(r => r.path == '/'+m.path)
					}else{
						return router.find(r => r.path == m.path)
					}
				})
				//重组对象
				filterRouter.forEach(item => {
					res.push({
						name: item.name,
						type: item.meta.type,
						path: item.meta.type=="link"?item.path.slice(1):item.path,
						icon: item.meta.icon,
						title: item.meta.title,
						breadcrumb: item.meta.breadcrumb.map(v => v.meta.title).join(' - ')
					})
				})
				return res
			},
			to(item){
				if(!this.history.includes(this.input)){
					this.history.push(this.input)
					this.$TOOL.data.set("SEARCH_HISTORY", this.history)
				}
				if(item.type=="link"){
					setTimeout(()=>{
						let a = document.createElement("a")
							a.style = "display: none"
							a.target = "_blank"
							a.href = item.path
							document.body.appendChild(a)
							a.click()
							document.body.removeChild(a)
					}, 10);
				}else{
					this.$router.push({path: item.path})
				}
				this.$emit('success', true)
			},
			historyClick(text){
				this.input = text
				this.inputChange(text)
			},
			historyClose(index){
				this.history.splice(index, 1);
				if(this.history.length <= 0){
					this.$TOOL.data.remove("SEARCH_HISTORY")
				}else{
					this.$TOOL.data.set("SEARCH_HISTORY", this.history)
				}
			}
		}
	}
</script>

<style scoped>
	.sc-search {}
	.sc-search-no-result {text-align: center;margin: 40px 0;color: #999;}
	.sc-search-history {margin-top: 10px;}
	.sc-search-history .el-tag {cursor: pointer;}
	.sc-search-result {margin-top: 15px;}
	.sc-search-result li {height:56px;padding:0 15px;background: var(--el-bg-color-overlay);border: 1px solid var(--el-border-color-light);list-style:none;border-radius: 4px;margin-bottom: 5px;font-size: 14px;display: flex;align-items: center;cursor: pointer;}
	.sc-search-result li  i {font-size: 20px;margin-right: 15px;}
	.sc-search-result li:hover {background: var(--el-color-primary);color: #fff;border-color: var(--el-color-primary);}
</style>
