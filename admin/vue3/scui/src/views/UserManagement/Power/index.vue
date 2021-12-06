<template>
	<el-container>
		<el-aside width="300px" v-loading="menuloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="menuFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="menu" class="menu" node-key="id" :data="menuList" :props="menuProps" :draggable="$AUTH('PowerSort')" highlight-current :expand-on-click-node="false" check-strictly show-checkbox :filter-node-method="menuFilterNode" @node-click="menuClick" @node-drop="nodeDrop">

						<template #default="{node, data}">
							<span class="custom-tree-node el-tree-node__label">
								<span class="label">
									{{ node.label }}
								</span>
								<span class="do">
									<el-icon v-auth="['PowerCreate']" @click.stop="add(node, data)"><el-icon-plus /></el-icon>
								</span>
							</span>
						</template>

					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button v-auth="['PowerCreate']" type="primary" size="mini" icon="el-icon-plus" @click="add()"></el-button>
					<el-button v-auth="['PowerDestroy']" type="danger" size="mini" plain icon="el-icon-delete" @click="delMenu"></el-button>
					<el-button size="mini" plain @click="refreshMenu" icon="el-icon-refresh-right">刷新菜单</el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container>
			<el-main class="nopadding" style="padding:20px;" ref="main">
				<save ref="save" :menu="menuList"></save>
			</el-main>
		</el-container>
	</el-container>
</template>
<style lang='scss' scoped>
  @import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>