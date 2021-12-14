import API from "@/api";

//文件选择器配置

export default {
	apiObj: API.common.upload,
	menuApiObj: API.resourceGroup.list,
	listApiObj: API.resource.list,
	successCode: 200,
	maxSize: 20,
	max: 99,
	uploadParseData: function (res) {
		return {
			id: res.message.id,
			fileName: res.message.name,
			url: res.message.url
		}
	},
	listParseData: function (res) {
		return {
			rows: res.message.data,
			total: res.message.total,
			msg: res.message,
			code: res.code
		}
	},
	request: {
		page: 'page',
		pageSize: 'pageSize',
		keyword: 'keyword',
		menuKey: 'groupId'
	},
	menuProps: {
		key: 'id',
		label: 'name',
		children: 'children'
	},
	fileProps: {
		key: 'id',
		fileName: 'name',
		url: 'url'
	},
	files: {
		doc: {
			icon: 'sc-icon-file-word-2-fill',
			color: '#409eff'
		},
		docx: {
			icon: 'sc-icon-file-word-2-fill',
			color: '#409eff'
		},
		xls: {
			icon: 'sc-icon-file-excel-2-fill',
			color: '#67C23A'
		},
		xlsx: {
			icon: 'sc-icon-file-excel-2-fill',
			color: '#67C23A'
		},
		ppt: {
			icon: 'sc-icon-file-ppt-2-fill',
			color: '#F56C6C'
		},
		pptx: {
			icon: 'sc-icon-file-ppt-2-fill',
			color: '#F56C6C'
		}
	}
}
