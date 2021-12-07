<template>
	<el-row :gutter="40">
		<el-col v-if="!form.id">
			<el-empty :description="$t('power.selectLeftMenuOperate')" :image-size="100"></el-empty>
		</el-col>
		<template v-else>
			<el-col :lg="12">
				<h2>{{ form.title || $t('power.newMenu') }}</h2>
				<el-form
					:model="form"
					:rules="rules"
					ref="dialogForm"
					label-width="120px"
					label-position="left"
				>
					<el-form-item :label="$t('power.form.title.name')" prop="title">
						<el-input v-model="form.title" clearable :placeholder="$t('power.form.title.placeholder')" maxlength="50"></el-input>
					</el-form-item>
					<el-form-item :label="$t('power.form.pid.name')" prop="pid">
						<el-cascader
							v-model="form.pid"
							:options="menuOptions"
							:props="menuProps"
							:show-all-levels="false"
							:placeholder="$t('power.form.pid.placeholder')"
							clearable
							disabled
						></el-cascader>
						<div class="el-form-item-msg">{{$t('power.form.pid.msg')}}</div>
					</el-form-item>
					<el-form-item :label="$t('power.form.type.name')" prop="type">
						<el-radio-group v-model="form.type">
							<el-radio-button :label="1">{{$t('power.form.type.label.menu')}}</el-radio-button>
							<el-radio-button :label="2">{{$t('power.form.type.label.iframe')}}</el-radio-button>
							<el-radio-button :label="3">{{$t('power.form.type.label.link')}}</el-radio-button>
							<el-radio-button :label="4">{{$t('power.form.type.label.button')}}</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item :label="$t('power.form.api.name')" prop="api">
						<el-input v-model="form.api" clearable :placeholder="$t('power.form.api.placeholder')" maxlength="255"></el-input>
						<div class="el-form-item-msg">{{$t('power.form.api.msg')}}</div>
					</el-form-item>
					<el-form-item :label="$t('power.form.icon.name')" prop="icon">
						<sc-icon-select v-model="form.icon" clearable></sc-icon-select>
					</el-form-item>
					<el-form-item :label="$t('power.form.path.name')" prop="path">
						<el-input v-model="form.path" clearable :placeholder="$t('power.form.path.placeholder')" maxlength="255"></el-input>
					</el-form-item>
					<el-form-item :label="$t('power.form.redirectUrl.name')" prop="redirect_url">
						<el-input v-model="form.redirect_url" clearable placeholder></el-input>
					</el-form-item>
					<el-form-item :label="$t('power.form.active.name')" prop="active">
						<el-input v-model="form.active" clearable placeholder></el-input>
						<div class="el-form-item-msg">{{$t('power.form.active.msg')}}</div>
					</el-form-item>
					<el-form-item :label="$t('power.form.view.name')" prop="view">
						<el-input v-model="form.view" clearable placeholder>
							<template #prepend>views/</template>
						</el-input>
						<div class="el-form-item-msg">{{$t('power.form.view.msg')}}</div>
					</el-form-item>
					<el-form-item :label="$t('power.form.color.name')" prop="color">
						<el-color-picker v-model="form.color" :predefine="predefineColors"></el-color-picker>
					</el-form-item>
					<el-form-item :label="$t('power.form.isHidden.name')" prop="is_hidden">
						<el-checkbox v-model="form.is_hidden">{{$t('power.form.isHidden.hiddenMenu')}}</el-checkbox>
						<el-checkbox v-model="form.is_hidden_breadcrumb">{{$t('power.form.isHidden.hideCrumbs')}}</el-checkbox>
						<div class="el-form-item-msg">{{$t('power.form.isHidden.msg')}}</div>
					</el-form-item>
					<el-form-item :label="$t('power.form.isAffix.name')" prop="is_affix">
						<el-checkbox v-model="form.is_affix">{{$t('power.form.isAffix.immobilization')}}</el-checkbox>
						<div class="el-form-item-msg">{{$t('power.form.isAffix.msg')}}</div>
					</el-form-item>
					<el-form-item :label="$t('power.form.isFullPage.name')" prop="is_full_page">
						<el-checkbox v-model="form.is_full_page">{{$t('power.form.isFullPage.pageOpen')}}</el-checkbox>
						<div class="el-form-item-msg">{{$t('power.form.isFullPage.msg')}}</div>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="['PowerEdit']" type="primary" @click="save" :loading="loading">{{$t('general.save')}}</el-button>
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