<template>
	<el-container>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button v-auths="['ProductDestroy']" type="danger" plain icon="el-icon-delete"
						:disabled="selection.length == 0" @click="batch_del"></el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.keyword" placeholder="商品名称" clearable></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="apiObj" :column="column" :params="params"
					@selection-change="selectionChange" stripe row-key="id" remoteSort remoteFilter highlightCurrentRow>
					<el-table-column type="selection" width="50"></el-table-column>
					<template #goods_list="scope">
						<div v-for="item of scope.row.goods_list" :key="item.id" class="good_list">
							<el-image :src="item.good.img[0]" fit="cover" style="width: 45px; height: 45px;" />
							<el-tooltip class="box-item" effect="dark" :content="item.good.name" placement="top">
								<div class="name">{{ item.good.name }}</div>
							</el-tooltip>

						</div>
					</template>
					<template #total="scope">
						<span style="font-size: 8px;">¥</span>{{ $TOOL.groupSeparator(scope.row.total) }}元
					</template>
					<template #carriage="scope">
						<template v-if="scope.row.carriage">
							<span style="font-size: 8px;">¥</span>{{ $TOOL.groupSeparator(scope.row.carriage) }}元
						</template>
						<span v-else>免运费</span>
					</template>
					<template #state="scope">
						{{ state.find(item => item.value === scope.row.state)?.label }}
					</template>
					<el-table-column :label="$t('general.operation')" fixed="right" align="right" min-width="120">
						<template #default="scope">
							<el-button-group>
								<el-button link type="primary" size="small" v-auths="['ProductView']"
									@click="distribution_show(scope.row, scope.$index)">发货</el-button>
								<el-dropdown @command="handleCommand">
									<span class="el-dropdown-link">
										更多
										<el-icon class="el-icon--right">
											<el-icon-arrow-down />
										</el-icon>
									</span>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item :index="scope.$index" :data="scope.row"
												command="1">订单详情</el-dropdown-item>
											<el-dropdown-item
												v-if="scope.row.state === 1 || scope.row.state === 6 || scope.row.state === 7 || scope.row.state === 8"
												:index="scope.$index" :data="scope.row"
												command="2">立即退款</el-dropdown-item>
											<el-dropdown-item :index="scope.$index" :data="scope.row"
												command="3">删除订单</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>
	<!-- 发货-->
	<distribution-dialog v-auths="['ProductCreate', 'ProductEdit']" v-if="dialog.distribution" ref="distribution" @success="handleSuccess"
		@closed="dialog.distribution = false" :close-on-click-modal="false"></distribution-dialog>
	<!-- 订单详-->
	<el-drawer title="订单详情" size="70%" v-model="drawer.detail" direction="rtl" :before-close="$emit('closed')">
		<el-main style="padding:0 20px;" v-loading="loading">
			<el-descriptions title="订单信息">
				<el-descriptions-item label="订单号">{{ detail.identification }}</el-descriptions-item>
				<el-descriptions-item label="订单状态">{{ state.find(item => item.value ===
					detail.state)?.label }}</el-descriptions-item>
				<el-descriptions-item label="订单金额">{{ $TOOL.groupSeparator(detail.total) }}元</el-descriptions-item>
				<el-descriptions-item label="运费">{{ detail.carriage ? `${$TOOL.groupSeparator(detail.carriage)}元` :
					"免运费"
					}}</el-descriptions-item>

				<el-descriptions-item v-if="detail.pay_time" label="支付方式">{{ detail.pay_way }}</el-descriptions-item>
				<template v-if="detail.state === 7">
					<el-descriptions-item label="退款金额">{{ $TOOL.groupSeparator(detail.refund_money)
						}}元</el-descriptions-item>
					<el-descriptions-item label="退款方式">{{ detail.refund_way }}</el-descriptions-item>
					<el-descriptions-item label="退款原因">{{ detail.refund_reason }}</el-descriptions-item>
					<el-descriptions-item label="退款时间">{{ detail.refund_time }}</el-descriptions-item>
				</template>
				<el-descriptions-item label="创建时间">{{ detail.created_at }}</el-descriptions-item>
				<el-descriptions-item v-if="detail.pay_time" label="付款时间">{{ detail.pay_time }}</el-descriptions-item>
				<el-descriptions-item v-if="detail.shipping_time" label="发货时间">{{ detail.shipping_time
					}}</el-descriptions-item>
				<el-descriptions-item v-if="detail.receiving_time" label="收货时间">{{ detail.receiving_time
					}}</el-descriptions-item>
				<el-descriptions-item v-if="detail.confirm_time" label="订单完成时间">{{ detail.confirm_time
					}}</el-descriptions-item>

			</el-descriptions>
			<el-descriptions title="用户信息">
				<el-descriptions-item label="用户手机号">{{ detail.user.cellphone }}</el-descriptions-item>
				<el-descriptions-item label="备注">
					{{ detail.remark }}
				</el-descriptions-item>
			</el-descriptions>
			<el-descriptions v-if="detail.good_location" title="收货信息">
				<el-descriptions-item label="收货人">{{ detail.good_location.name }}</el-descriptions-item>
				<el-descriptions-item label="收货电话">{{ detail.good_location.cellphone }}</el-descriptions-item>
				<el-descriptions-item label="收货地址">{{ detail.good_location.address }}</el-descriptions-item>
			</el-descriptions>
			<el-table :data="detail.goods_list" :summary-method="getSummaries" border show-summary style="width: 100%">
				<el-table-column type="index" label="编号" width="50" />
				<el-table-column align="center" width="80">
					<template #default="scope">
						<el-image :src="scope.row.img" :preview-src-list="[scope.row.img]"
							style="width:45px;height:45px;" />
					</template>
				</el-table-column>
				<el-table-column label="商品" align="left">
					<template #default="scope">
						<router-link
							:to="{ path: '/commodityManagement/good/goodDetail', query: { id: scope.row.good_id } }"
							target="_blank"> {{ scope.row.name }}</router-link>
					</template>
				</el-table-column>
				<el-table-column label="类型" align="center">
					<template #default="scope">
						<span>{{ scope.row.good.type }}</span>
					</template>
				</el-table-column>
				<el-table-column label="规格">
					<template #default="scope">
						<template v-if="scope.row.good_sku">
							<span v-for="item of scope.row.good_sku.product_sku" :key="item.value">{{
								`${item.key}:${item.value};` }}</span>
						</template>
					</template>
				</el-table-column>
				<el-table-column label="单价（元）" align="center">
					<template #default="scope">
						<span>{{ scope.row.price }}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量（件）" align="center">
					<template #default="scope">
						<span>{{ scope.row.number }}</span>
					</template>
				</el-table-column>
				<el-table-column label="金额（元）" align="center">
					<template #default="scope">
						<span>{{ scope.row.price * scope.row.number }}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
	</el-drawer>
</template>
<style lang='scss' scoped>
@use "./scss/index.scss" as *;
</style>

<script>
import js from './js/index'
export default js
</script>
