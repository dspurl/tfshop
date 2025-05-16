<template>
	<sc-page-header :title="name ? name : '创建插件'" description icon="el-icon-burger"></sc-page-header>
	<el-main>
		<el-card shadow="never" v-loading="loading">
			<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="ruleForm">
				<el-tabs>
					<el-tab-pane label="基础信息">
						<el-form-item label="插件名称" prop="name">
							<el-input
								class="min-input"
								v-model="ruleForm.name"
								maxlength="20"
								placeholder="请输入插件名称"
								clearable
							/>
						</el-form-item>
						<el-form-item label="插件标识" prop="abbreviation">
							<el-input
								class="min-input"
								v-model="ruleForm.abbreviation"
								maxlength="20"
								placeholder="请输入插件标识"
								clearable
							/>
						</el-form-item>
						<el-form-item label="作者" prop="author">
							<el-input
								class="min-input"
								v-model="ruleForm.author"
								maxlength="20"
								placeholder="请输入作者"
								clearable
							/>
						</el-form-item>
						<el-form-item label="插件简介" prop="describe">
							<el-input
								class="min-input"
								v-model="ruleForm.describe"
								maxlength="200"
								type="textarea"
								placeholder="请输入插件简介"
								clearable
							/>
						</el-form-item>
						 <el-form-item label="支持的客户端模板" prop="client">
							<el-select class="min-input" v-model="ruleForm.clientTemplate" multiple clearable placeholder="请选择">
								<el-option-group v-for="group in template" :key="group.name" :label="group.name">
									<el-option
										v-for="item in group.children"
										:key="item.en"
										:label="item.name"
										:value="group.name + '/' + item.en"
									/>
								</el-option-group>
							</el-select>
						</el-form-item>
						<el-form-item label="支持的后端模板" prop="serverTemplate">
							<el-select
								class="min-input"
								v-model="ruleForm.serverTemplate"
								multiple
								clearable
								placeholder="请选择"
							>
								<el-option-group v-for="group in serverTemplate" :key="group.name" :label="group.name">
									<el-option
										v-for="item in group.children"
										:key="item.en"
										:label="item.name"
										:value="group.name + '/' + item.en"
									/>
								</el-option-group>
							</el-select>
							<div class="el-form-item-msg">创建数据库时，会根据支持的客户端自动创建相关的模板</div>
						</el-form-item>
						<el-form-item label="支持的后台模板" prop="adminTemplate">
							<el-select
								class="min-input"
								v-model="ruleForm.adminTemplate"
								multiple
								clearable
								placeholder="请选择"
							>
								<el-option-group v-for="group in adminTemplate" :key="group.name" :label="group.name">
									<el-option
										v-for="item in group.children"
										:key="item.en"
										:label="item.name"
										:value="group.name + '/' + item.en"
									/>
								</el-option-group>
							</el-select>
							<div class="el-form-item-msg">创建数据库时，会根据支持的客户端自动创建相关的模板</div>
						</el-form-item>
						<el-form-item label="使用说明" prop="instructions">
							<mavon-editor
								v-model="ruleForm.instructions"
								:xss_options="xssOptions"
								:toolbars="markdownOption"
								:ishljs="true"
								code-style="atom-one-dark"
								placeholder="请输入正文"
							/>
							<div class="el-form-item-msg">使用说明支持markdown语法</div>
						</el-form-item>
						<el-form-item label="插件版本" prop="versions">
							<el-input
								class="min-input"
								v-model="ruleForm.versions"
								maxlength="20"
								placeholder="请输入插件版本"
								clearable
							/>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="数据库" lazy>
						<div class="el-form-item-msg">
							<p>1、创建的表可以是伪数据表，即不创建数据表，只需要创建一些模板和后端代码</p>
							<p>2、删除插件时，将会删除自动生成的文件，其它非自动生成的文件不会进行删除</p>
							<p>3、创建的插件不会自动生成数据表，需要通过命令行执行`php artisan migrate`，打包好后，其它用户使用时，会自动生成对应的数据表，无需执行命名行</p>
							<p>4、自己添加的路由请带上name属性，name命名格式：admin/client.权限名，如`admin.adminList`</p>
						</div>
						<el-container>
							<el-header>
								<div class="left-panel">
									<el-button
										v-auths="['AdminCreate']"
										type="primary"
										icon="el-icon-plus"
										@click="addDataTable"
									></el-button>
								</div>
							</el-header>
						</el-container>
						<el-table :data="ruleForm.db" style="width: 100%">
							<el-table-column prop="name" label="表名" width="200">
								<template #default="scope">{{ scope.row.name }}</template>
							</el-table-column>
							<el-table-column prop="annotation" label="表注释" width="200">
								<template #default="scope">{{ scope.row.annotation }}</template>
							</el-table-column>
							<el-table-column prop="softDeletes" label="软删除" width="80">
								<template #default="scope">{{ scope.row.softDeletes ? '支持' : '不支持' }}</template>
							</el-table-column>
							<el-table-column prop="timestamps" label="timestamps" width="120">
								<template #default="scope">{{ scope.row.timestamps ? '支持' : '不支持' }}</template>
							</el-table-column>
							<el-table-column prop="reset" label="数据表" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.data_table" active-text="生成" inactive-text="不生成" />
								</template>
							</el-table-column>
							<el-table-column prop="reset" label="后端代码" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.after_end" active-text="生成" inactive-text="不生成" />
								</template>
							</el-table-column>
							<el-table-column prop="reset" label="后台代码" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.backstage" active-text="生成" inactive-text="不生成" />
								</template>
							</el-table-column>
							<el-table-column prop="reset" label="客户端代码" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.client" active-text="生成" inactive-text="不生成" />
								</template>
							</el-table-column>
							<el-table-column prop="reset" label="权限" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.jurisdiction" active-text="生成" inactive-text="不生成" />
								</template>
							</el-table-column>
							<el-table-column prop="reset" label="是否重置" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.reset" active-text="是" inactive-text="否" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="120" fixed="right">
								<template #default="scope">
									<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
										<el-button
											type="primary"
											icon="el-icon-edit"
											circle
											@click="editDataTable(scope.row, scope.$index)"
										/>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											@click="deleteDataTable(scope.$index)"
										/>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="观察者" lazy>
						<div class="el-form-item-msg">
							<p>1、如果你的插件涉及到其它插件或需要在某个业务执行前后去做处理，那请用观察者，而不是直接去修改业务代码</p>
						</div>
						<el-container>
							<el-header>
								<div class="left-panel">
									<el-button
										v-auths="['AdminCreate']"
										type="primary"
										icon="el-icon-plus"
										@click="addObserverTable"
									></el-button>
								</div>
							</el-header>
						</el-container>
						<el-table :data="ruleForm.observer" style="width: 100%">
							<el-table-column prop="name" label="观察者名称" width="300">
								<template #default="scope">{{ scope.row.name }}</template>
							</el-table-column>
							<el-table-column prop="models" label="依赖模型" width="300">
								<template #default="scope">{{ scope.row.models }}</template>
							</el-table-column>
							<el-table-column prop="path" label="可执行路由" width="300">
								<template #default="scope">{{ scope.row.path }}</template>
							</el-table-column>
							<el-table-column prop="explain" label="说明">
								<template #default="scope">{{ scope.row.explain }}</template>
							</el-table-column>
							<el-table-column prop="reset" label="是否重置" width="200">
								<template #default="scope">
									<el-switch v-model="scope.row.reset" active-text="是" inactive-text="否" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="120" fixed="right">
								<template #default="scope">
									<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
										<el-button
											type="primary"
											icon="el-icon-edit"
											circle
											@click="editObserverTable(scope.row, scope.$index)"
										/>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											@click="deleteObserverTable(scope.$index)"
										/>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="依赖插件" lazy>
						<div class="el-form-item-msg">
							<p>如果您的插件需要依赖其它插件才可以运作，或是有根据其它插件开发对应的功能，可通过添加依赖插件实现</p>
						</div>
						<el-container>
							<el-header>
								<div class="left-panel">
									<el-button
										v-auths="['AdminCreate']"
										type="primary"
										icon="el-icon-plus"
										@click="addRelyOnTable"
									></el-button>
								</div>
							</el-header>
						</el-container>
						<el-table :data="ruleForm.relyOn" style="width: 100%">
							<el-table-column prop="file" label="依赖的插件">
								<template #default="scope">{{ scope.row.name }}</template>
							</el-table-column>
							<el-table-column prop="explain" label="是否必须">
								<template #default="scope">{{ scope.row.must ? '是' : '否' }}</template>
							</el-table-column>
							<el-table-column label="操作" width="120" fixed="right">
								<template #default="scope">
									<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
										<el-button type="primary" icon="el-icon-edit" circle @click="editRelyOnTable(scope.row)" />
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											@click="deleteRelyOnTable(scope.$index)"
										/>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="关联文件" lazy>
						<div class="el-form-item-msg">
							<p>关联文件不能存在相同的文件名或目录名，如客户端和移动端相同，请自行修改</p>
						</div>
						<el-container>
							<el-header>
								<div class="left-panel">
									<el-button
										v-auths="['AdminCreate']"
										type="primary"
										icon="el-icon-plus"
										@click="addRelevanceTable"
									></el-button>
								</div>
							</el-header>
						</el-container>
						<el-table :data="ruleForm.relevance" style="width: 100%">
							<el-table-column prop="file" label="文件">
								<template #default="scope">{{ scope.row.file }}</template>
							</el-table-column>
							<el-table-column prop="explain" label="说明">
								<template #default="scope">{{ scope.row.explain }}</template>
							</el-table-column>
							<el-table-column label="操作" width="120" fixed="right">
								<template #default="scope">
									<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
										<el-button
											type="primary"
											icon="el-icon-edit"
											circle
											@click="editRelevanceTable(scope.row)"
										/>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											@click="deleteRelevanceTable(scope.$index)"
										/>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="设置" lazy>
						<el-form-item label="是否重置路由" prop="routes">
							<el-switch v-model="ruleForm.routes" active-text="是" inactive-text="否" />
							<div class="el-form-item-msg">重置后将会重新生成后台路由代码、后端路由代码、语言包路由代码</div>
						</el-form-item>
						<el-form-item label="打包权限" prop="packagingJurisdiction">
							<el-tree
								ref="menu"
								node-key="id"
								:data="fromData"
								:default-checked-keys="ruleForm.packagingJurisdiction"
								:props="{ label: 'label' }"
								show-checkbox
							></el-tree>
							<div class="el-form-item-msg">
								<p>1、如果有设计到后台权限，请配置此处，不然则无需配置</p>
								<p>2、插件权限在卸载的时候，不会对一级权限进行删除，如需要删除，请通过权限管理自行手动删除</p>
								<p>3、配置打包插件所需要的权限，配置后的权限在用户安装插件时会根据该权限进行添加</p>
								<p>4、打包权限为最终插件所需权限，请确保配置正常，不然将导致用户安装插件后无法正常使用插件</p>
							</div>
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		<div class="footer">
			<el-button type="primary" :loading="isSaveing" @click="submit()">保存</el-button>
		</div>
	</el-main>
	<!-- 数据库-->
	<database-dialog
		ref="databaseDialog"
		v-model="ruleForm.db"
		@closed="dialog.database = false"
		:close-on-click-modal="false"
	></database-dialog>
	<!-- 观察者-->
	<observer-dialog
		ref="observerDialog"
		v-model="ruleForm.observer"
		@closed="dialog.observer = false"
		:close-on-click-modal="false"
	></observer-dialog>
	<!-- 依赖插件-->
	<relyOn-dialog
		ref="relyOnDialog"
		v-model="ruleForm.relyOn"
		@closed="dialog.relyOn = false"
		:close-on-click-modal="false"
	></relyOn-dialog>
	<!-- 关联文件-->
	<relevance-dialog
		ref="relevanceDialog"
		v-model="ruleForm.relevance"
		@closed="dialog.relevance = false"
		:close-on-click-modal="false"
	></relevance-dialog>
</template>

<style lang='scss' scoped>
@use "./scss/save.scss" as *;
</style>

<script>
import js from './js/save'
export default js
</script>
