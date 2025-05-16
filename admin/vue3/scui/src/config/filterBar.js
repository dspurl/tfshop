import API from "@/api";
import i18n from "@/locales";
export default {
	//运算符
	operator: [
		{
			label: i18n.global.tc('config.filterBar.operator.eq'),
			value: "=",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.neq'),
			value: "!=",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.gt'),
			value: ">",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.gte'),
			value: ">=",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.lt'),
			value: "<",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.le'),
			value: "<=",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.include'),
			value: "include",
		},
		{
			label: i18n.global.tc('config.filterBar.operator.notinclude'),
			value: "notinclude",
		},
	],
	//过滤结果运算符的分隔符
	separator: "|",
	//获取我的常用
	async getMy(authRule) {
		let list = [];
		const res = await API.adminFilter.list.get({
			authRule: authRule,
		});
		list = res.message;
		return list;
	},
	/**
	 * 常用保存处理
	 * @authRule 权限别名
	 * @obj 过滤项整理好的对象
	 * @type 类型 my:该账号 all:所有账号
	 */
	async saveMy(authRule, obj, type) {
		if (obj.id) {
			await API.adminFilter.edit.post({
				id: obj.id,
				title: obj.title,
				data: obj.filterObj,
			});
		} else {
			await API.adminFilter.create.post({
				title: obj.title,
				data: obj.filterObj,
				type: type,
				authRule: authRule,
			});
		}
		return true;
	},
	/**
	 * 常用删除处理
	 * @name scFilterBar组件的props->filterName
	 */
	async delMy(id) {
		await API.adminFilter.destroy.post(id);
		return true;
	},
};
