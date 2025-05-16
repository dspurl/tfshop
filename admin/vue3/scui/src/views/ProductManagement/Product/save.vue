<template>
	<sc-dialog :title="titleMap[mode]" v-model="visible" :width="1000" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode == 'show'" ref="dialogForm" label-width="120px"
			label-position="right">
			<el-form-item label="商品类型" prop="type">
				<el-radio-group v-model="form.type">
					<el-radio-button label="普通商品" :value="0" />
					<el-radio-button label="虚拟商品" :value="1" />
					<el-radio-button label="卡密/网盘" :value="2" />
					<el-radio-button label="下载商品" :value="3" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="商品轮播图" prop="img">
				<tf-file-select v-model="form.img" multiple draggable width="120px" height="120px" :maxSize="2"
					:limit="10" uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"></tf-file-select>
				<div class="el-form-item-msg">轮播图要求1-10张，宽高比例为1:1且宽高大于800px为佳，大小2M内</div>
			</el-form-item>
			<el-form-item label="商品主图">
				<el-image style="width: 120px; height: 120px" :src="form.img.length ? form.img[0] : ''" fit="cover" />
				<div class="el-form-item-msg">轮播图第一张为商品主图</div>
			</el-form-item>
			<el-form-item label="商品视频" prop="video">
				<tf-file-select v-model="form.video" width="240px" height="240px" :maxSize="20"
					uuid="3cee45a0-5893-11ec-9eee-4b1f6ea9308a"></tf-file-select>
				<div class="el-form-item-msg">使用宽高比1:1或3:4或16:9视频（建议优先采用1:1或3:4视频），大小20M内</div>
			</el-form-item>
			<el-form-item label="商品视频缩略图">
				<tf-file-select v-model="form.video_img" width="120px" height="120px" :maxSize="2" uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"></tf-file-select>
				<div class="el-form-item-msg">商品视频缩略图</div>
			</el-form-item>
			<el-form-item label="商品名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入商品名称" clearable show-word-limit maxlength="60"></el-input>
			</el-form-item>
			<el-form-item label="关键字" prop="keywords">
				<el-input v-model="form.keywords" placeholder="请输入关键字" clearable show-word-limit
					maxlength="60"></el-input>
			</el-form-item>
			<el-form-item label="短描述	" prop="short_description">
				<el-input v-model="form.short_description" placeholder="请输入短描述" clearable show-word-limit
					maxlength="60"></el-input>
			</el-form-item>
			<el-form-item label="商品分类" prop="category_id">
				<el-cascader :props="{ value: 'id', label: 'name' }" v-model="form.category_id" :options="categoryList"
					clearable />
			</el-form-item>
			<el-form-item label="规格类型" prop="specification_type">
				<el-radio-group v-model="form.specification_type">
					<el-radio :value="0">单规格</el-radio>
					<el-radio :value="1">多规格</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 单规格-->
			<template v-if="form.specification_type === 0">
				<el-form-item v-if="form.type === 3" label="下载文件" prop="download">
					<tf-file-select v-model="form.download" width="120px" height="120px" :maxSize="20"
						uuid="e7b26940-58c4-11ec-be8a-d951fa410f9e"></tf-file-select>
					<div class="el-form-item-msg">上传需要下载的内容，20MB以内</div>
				</el-form-item>
				<template v-if="form.type === 2">
					<el-form-item label="卡密类型" prop="code_type">
						<el-radio-group v-model="form.code_type" @change="handleCode">
							<el-radio :value="0">卡密</el-radio>
							<el-radio :value="1">网盘</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否固定卡密" prop="is_fixed" @change="handleCode">
						<el-radio-group v-model="form.is_fixed">
							<el-radio :value="0">否</el-radio>
							<el-radio :value="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="数据" prop="good_code">
						<sc-form-table ref="goodCodeTable" v-model="form.good_code"
							:hideAdd="form.is_fixed === 1 && form.good_code.length > 0 ? true : false"
							:addTemplate="addTemplate" drag-sort placeholder="暂无数据">
							<el-table-column prop="name" :label="form.code_type === 0 ? `卡号` : `网盘地址`" min-width="300">
								<template #default="scope">
									<el-input v-model="scope.row.name"
										:placeholder="form.code_type === 0 ? `请输入卡号(非必填)` : `请输入网盘地址`" clearable
										show-word-limit maxlength="255"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="code" :label="form.code_type === 0 ? `卡密` : `提取码`" min-width="300">
								<template #default="scope">
									<el-input v-model="scope.row.code"
										:placeholder="form.code_type === 0 ? `请输入卡密` : `请输入提取码`" clearable
										show-word-limit maxlength="255"></el-input>
								</template>
							</el-table-column>
						</sc-form-table>
						<el-button v-if="form.is_fixed === 0" @click="handleUpload" style="margin-top:5px;">导入{{
							form.code_type === 0 ? `卡密` :
								`网盘`
						}}</el-button>
					</el-form-item>
				</template>
				<el-form-item label="售价" prop="price">
					<el-input v-model="form.price" placeholder="请输入售价" clearable show-word-limit
						maxlength="9"></el-input>
				</el-form-item>
				<el-form-item label="成本价" prop="cost_price">
					<el-input v-model="form.cost_price" placeholder="请输入成本价" clearable show-word-limit
						maxlength="9"></el-input>
				</el-form-item>
				<el-form-item label="划线价" prop="market_price">
					<el-input v-model="form.market_price" placeholder="请输入划线价" clearable show-word-limit
						maxlength="9"></el-input>
				</el-form-item>
				<el-form-item label="库存" prop="inventory">
					<el-input v-model="form.inventory" placeholder="请输入库存" clearable show-word-limit
						maxlength="11"></el-input>
				</el-form-item>
			</template>
			<!-- 多规格-->
			<template v-else>
				<el-form-item label="商品规格" prop="good_sku">
					<sc-form-table ref="goodSkuSpecificationTable" v-model="goodSkuSpecification"
						:addTemplate="addGoodSkuSpecificationTemplate" drag-sort placeholder="暂无数据">
						<el-table-column prop="parent" label="父规格" min-width="300">
							<template #default="scope">
								<el-input v-model="scope.row.parent" placeholder="请输入父规格名称" clearable show-word-limit
									maxlength="30"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="children" label="子规格" min-width="400">
							<template #default="scope">
								<el-input-tag clearable draggable v-model="scope.row.children"
									placeholder="请输入子规格(回车添加)"></el-input-tag>
							</template>
						</el-table-column>
					</sc-form-table>
				</el-form-item>
				<el-form-item label="SKU信息" prop="good_sku">
					<el-table :data="skuLineData" border style="width: 100%">
						<el-table-column v-for="(item, index) in goodSkuSpecification" :key="index" :label="item.parent"
							align="center" width="180">
							<template #default="scope">
								{{ scope.row.product_sku[index]?.value }}
							</template>
						</el-table-column>
						<el-table-column prop="img" label="预览图" width="200">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="img" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'change',
										},
									]">
										<tf-file-select v-model="scope.row.img" width="120px" height="120px"
											:maxSize="2" uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"></tf-file-select>
										<div class="el-form-item-msg">预览图宽高比例为1:1且宽高大于800px为佳，大小2M内</div>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="售价" width="200">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="price" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'blur',
										},
									]">
										<el-input v-model="scope.row.price" placeholder="请输入售价" clearable
											show-word-limit maxlength="9"></el-input>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column prop="cost_price" label="成本价" width="200">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="cost_price" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'blur',
										},
									]">
										<el-input v-model="scope.row.cost_price" placeholder="请输入成本价" clearable
											show-word-limit maxlength="9"></el-input>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column prop="market_price" label="划线价" width="200">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="market_price" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'blur',
										},
									]">
										<el-input v-model="scope.row.market_price" placeholder="请输入划线价" clearable
											show-word-limit maxlength="9"></el-input>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column prop="inventory" label="库存" width="200">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="inventory" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'blur',
										},
									]">
										<el-input v-model="scope.row.inventory" placeholder="请输入库存" clearable
											show-word-limit maxlength="11"></el-input>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column v-if="form.type === 3" prop="download" label="下载内容" width="200">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="download" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'change',
										},
									]">
										<tf-file-select v-model="scope.row.download" width="120px" height="120px"
											:maxSize="20" uuid="e7b26940-58c4-11ec-be8a-d951fa410f9e"></tf-file-select>
										<div class="el-form-item-msg">上传需要下载的内容，20MB以内</div>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column v-if="form.type === 2" prop="good_code" label="操作" width="120" align="center">
							<template #default="scope">
								<el-form :disabled="mode == 'show'" :ref="`sku${scope.$index}`" :model="scope.row">
									<el-form-item prop="good_code" label-width="0" label=" " :rules="[
										{
											required: true,
											trigger: 'blur',
										},
									]">
										<el-button
											@click="scope.row.good_code.length > 0 ? table_edit(scope.row, scope.$index) : table_add(scope.$index)">{{
												scope.row.good_code.length
													> 0 ? '修改' : '添加' }}卡密{{ scope.row.download }}</el-button>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</template>
			<el-form-item label="详情" prop="details">
				<el-row class="container-main" :gutter="10">
					<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<sc-editor class="editor-container" v-model="form.details" placeholder="请输入" :plugins="plugins"
							:toolbar="toolbar" :height="600"></sc-editor>
					</el-col>
					<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<div class="mobile-container">
							<header class="header">
								详情预览
							</header>
							<main class="main-content">
								<div v-html="form.details"></div>
							</main>
						</div>
					</el-col>
				</el-row>
			</el-form-item>
			<template v-if="form.type === 0">
				<el-form-item label="物流方式" prop="freight_type">
					<el-radio-group v-model="form.freight_type">
						<el-radio :value="0">固定邮费</el-radio>
						<el-radio :value="1">运费模板</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.freight_type === 0" label="运费" prop="freight">
					<el-input v-model="form.freight" placeholder="请输入运费" clearable show-word-limit
						maxlength="9"></el-input>
				</el-form-item>
				<el-form-item v-else label="运费模板" prop="freight_id">
					<el-select v-model="form.freight_id" clearable>
						<el-option v-for="item in freightList" :key="item.id" :label="item.name"
							:value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</template>
			<el-form-item label="上架时间" prop="is_show">
				<el-radio-group v-model="form.is_show">
					<el-radio :value="0">暂不售卖，放入仓库</el-radio>
					<el-radio :value="1">立即上架售卖</el-radio>
					<el-radio :value="2">定时上架</el-radio>
					<el-date-picker :disabled="form.is_show !== 2" v-model="form.timing" type="date"
						value-format="YYYY-MM-DD" placeholder="请选择上架时间"></el-date-picker>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="减库存方式" prop="is_inventory">
				<el-radio-group v-model="form.is_inventory">
					<el-radio :value="0">拍下减库存</el-radio>
					<el-radio :value="1">付款减库存</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否推荐" prop="is_recommend">
				<el-radio-group v-model="form.is_recommend">
					<el-radio :value="0">否</el-radio>
					<el-radio :value="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="货号" prop="number">
				<el-input v-model="form.number" placeholder="请输入货号" clearable show-word-limit maxlength="50"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input v-model="form.sort" placeholder="请输入排序" clearable show-word-limit maxlength="11"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{
				$t("general.cancel")
			}}</el-button>
			<el-button v-if="mode != 'show'" type="primary" :loading="isSaveing" @click="submit()">{{ $t("general.save")
				}}</el-button>
		</template>
		<code-dialog v-auths="['ProductCreate', 'ProductEdit']" v-if="dialog.code" ref="codeDialog"
			@success="handleSuccess" @closed="dialog.code = false" :close-on-click-modal="false"></code-dialog>
	</sc-dialog>
</template>
<style lang="scss" scoped>
@use "./scss/save.scss" as *;
</style>

<script>
import js from "./js/save";
export default js;
</script>
