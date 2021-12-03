<template>
	<el-row :gutter="40">
		<el-col v-if="!form.id">
			<el-empty description="请选择左侧菜单后操作" :image-size="100"></el-empty>
		</el-col>
		<template v-else>
			<el-col :lg="12">
				<h2>{{form.title || "新增菜单"}}</h2>
				<el-form :model="form" :rules="rules" ref="dialogForm" label-width="120px" label-position="left">
					<el-form-item label="显示名称" prop="title">
						<el-input v-model="form.title" clearable placeholder="菜单显示名字" maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="上级菜单" prop="pid">
						<el-cascader v-model="form.pid" :options="menuOptions" :props="menuProps" :show-all-levels="false" placeholder="顶级菜单" clearable disabled></el-cascader>
					</el-form-item>
					<el-form-item label="类型" prop="type">
						<el-radio-group v-model="form.type">
							<el-radio-button :label="1">菜单</el-radio-button>
							<el-radio-button :label="2">Iframe</el-radio-button>
							<el-radio-button :label="3">外链</el-radio-button>
							<el-radio-button :label="4">按钮</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="别名" prop="api">
						<el-input v-model="form.api" clearable placeholder="菜单别名" maxlength="255"></el-input>
						<div class="el-form-item-msg">系统唯一且与内置组件名一致，否则导致缓存失效；此字段可用于权限判断；如类型为Iframe的菜单，别名将代替源地址显示在地址栏</div>
					</el-form-item>
					<el-form-item label="菜单图标" prop="icon">
						<sc-icon-select v-model="form.icon" clearable></sc-icon-select>
					</el-form-item>
					<el-form-item label="路由地址" prop="path">
						<el-input v-model="form.path" clearable placeholder="路由地址" maxlength="255"></el-input>
					</el-form-item>
					<el-form-item label="重定向" prop="redirect_url">
						<el-input v-model="form.redirect_url" clearable placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="菜单高亮" prop="active">
						<el-input v-model="form.active" clearable placeholder=""></el-input>
						<div class="el-form-item-msg">子节点或详情页需要高亮的上级菜单路由地址</div>
					</el-form-item>
					<el-form-item label="视图" prop="view">
						<el-input v-model="form.view" clearable placeholder="">
							<template #prepend>views/</template>
						</el-input>
						<div class="el-form-item-msg">如父节点、链接或Iframe等没有视图的菜单不需要填写</div>
					</el-form-item>
					<el-form-item label="颜色" prop="color">
						<el-color-picker v-model="form.color" :predefine="predefineColors"></el-color-picker>
					</el-form-item>
					<el-form-item label="是否隐藏" prop="is_hidden">
						<el-checkbox v-model="form.is_hidden">隐藏菜单</el-checkbox>
						<el-checkbox v-model="form.is_hidden_breadcrumb">隐藏面包屑</el-checkbox>
						<div class="el-form-item-msg">菜单不显示在导航中，但用户依然可以访问，例如详情页</div>
					</el-form-item>
					<el-form-item label="是否固定" prop="is_affix">
						<el-checkbox v-model="form.is_affix">固定</el-checkbox>
						<div class="el-form-item-msg">固定后在面包屑无法被关闭</div>
					</el-form-item>
					<el-form-item label="是否整页打开" prop="is_full_page">
						<el-checkbox v-model="form.is_full_page">整页打开</el-checkbox>
						<div class="el-form-item-msg">是否整页打开路由（脱离框架系）</div>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="['PowerEdit']" type="primary" @click="save" :loading="loading">保 存</el-button>
					</el-form-item>
				</el-form>

			</el-col>
		</template>
	</el-row>

</template>
<style lang='scss' scoped>
  @import "./scss/save.scss";
</style>

<script>
import js from './js/save'
export default js
</script>