export default {
	general: {
		keywordFiltering: "输入关键字进行过滤",
		refreshMenu: "刷新菜单",
		unnamed: "未命名",
		selectDelete: "请选择需要删除的项",
		delete: "删除",
		deleteSuccessfully: "删除成功",
		confirmDeleteMenu: "确认删除已选择的菜单吗？",
		deleteSelectedAndChild:
			"确定删除选中的 {Number} 项吗？如果删除项中含有子集将会被一并删除",
		hint: "提示",
		retrieveMenu: "重新获取菜单中，请不要操作，耐心等待~",
		saveSuccessfully: "保存成功",
		operateSuccessfully: "操作成功",
		save: "保存",
		confirm: "确定",
		cancel: "取消",
		operation: "操作",
		view: "查看",
		edit: "编辑",
		preview: "预览",
		add: "新增",
		sureDelete: "确定删除吗？",
		pleaseInput: "请输入",
		pleaseSelect: "请选择",
		formatWrong: "格式有误",
		nothing: "无",
		noData: "无数据",
		rename: "重命名",
		ack: "输入关键词后按回车确认",
	},
	setting: {
		form: {
			colorPrimary: {
				name: "主题颜色",
			},
			layout: {
				name: "框架布局",
				placeholder: "请选择",
				default: "默认",
				header: "通栏",
				classics: "经典",
				functionDock: "功能坞",
			},
			menuIsCollapse: {
				name: "折叠菜单",
			},
			layoutTags: {
				name: "标签栏",
			},
		},
	},
	config: {
		filterBar: {
			operator: {
				eq: "等于",
				neq: "不等于",
				gt: "大于",
				gte: "大于等于",
				lt: "小于",
				le: "小于等于",
				include: "包含",
				notinclude: "不包含",
			},
		},
	},
	request: {
		error: "请求错误",
		unknownError: "未知错误",
		noResponse: "请求服务器无响应！",
		reLogin: {
			title: "确定登出",
			info: "长时间未操作，你已被登出，可以取消继续留在该页面，或者重新登录",
			confirmButtonText: "重新登录",
			cancelButtonText: "取消",
		},
		404: "正在请求不存在的服务器记录！",
		500: "服务器发生错误！",
	},
	form: {
		date: "日期",
		startDate: "开始日期",
		endDate: "结束日期",
	},
	filterBar: {
		common: {
			title: "我的常用过滤",
			no: {
				title: "没有常用的过滤",
				explain:
					"常用过滤可以将多个过滤条件保存为一个集合，方便下次进行相同条件的过滤",
			},
			del: "确认删除此常用过滤吗？",
		},
		index: {
			title: "过滤器",
			project: "过滤项",
			conditionTitle: "设置过滤条件",
			conditionNoData: "没有默认过滤条件，请点击增加过滤项",
			field: "过滤字段",
			operator: "运算符",
			add: "增加过滤项",
			immediately: "立即过滤",
			saveMy: "另存为常用(本账号)",
			saveAll: "另存为常用(所有账号)",
			empty: "清空过滤",
			nothing: "无过滤项",
			prompt: {
				title: "常用过滤名称",
				inputTitle: "另存为常用",
				inputPlaceholder: "请输入识别度较高的常用过滤名称",
				inputErrorMessage: "名称不能为空",
			},
			succeed: "保存常用成功",
		},
	},
	login: {
		slogan: "高性能 / 精致 / 优雅",
		describe: "基于Vue3 + Element-Plus 的中后台前端解决方案。",
		signInTitle: "用户登录",
		rememberMe: "记住我",
		forgetPassword: "忘记密码",
		signIn: "登录",
		signInOther: "其他登录方式",
		userPlaceholder: "用户名 / 手机 / 邮箱",
		userError: "请输入用户名",
		PWPlaceholder: "请输入密码",
		PWError: "请输入密码",
		admin: "管理员",
		user: "用户",
		succeed: "登录成功",
	},
	user: {
		dynamic: "近期动态",
		info: "个人信息",
		settings: "设置",
		nightmode: "黑夜模式",
		nightmode_msg: "适合光线较弱的环境，当前黑暗模式为beta版本",
		language: "语言",
		language_msg: "翻译进行中，暂翻译了本视图的文本",
	},
	power: {
		selectLeftMenuOperate: "请选择左侧菜单后操作",
		newMenu: "新增菜单",
		form: {
			title: {
				name: "显示名称",
				placeholder: "菜单显示名字",
			},
			pid: {
				name: "上级菜单",
				placeholder: "顶级菜单",
				msg: "设为菜单的请确保有子类，不然权限将无法添加",
			},
			type: {
				name: "类型",
				label: {
					menu: "菜单",
					iframe: "Iframe",
					link: "外链",
					button: "按钮",
				},
			},
			api: {
				name: "别名",
				placeholder: "菜单别名",
				msg: "系统唯一且与内置组件名一致，否则导致缓存失效；此字段可用于权限判断；如类型为Iframe的菜单，别名将代替源地址显示在地址栏",
			},
			icon: {
				name: "菜单图标",
			},
			path: {
				name: "路由地址",
				placeholder: "路由地址",
			},
			redirectUrl: {
				name: "重定向",
			},
			active: {
				name: "菜单高亮",
				msg: "子节点或详情页需要高亮的上级菜单路由地址",
			},
			view: {
				name: "视图",
				msg: "如父节点、链接或Iframe等没有视图的菜单不需要填写",
			},
			color: {
				name: "颜色",
			},
			isHidden: {
				name: "是否隐藏",
				hiddenMenu: "隐藏菜单",
				hideCrumbs: "隐藏面包屑",
				msg: "菜单不显示在导航中，但用户依然可以访问，例如详情页",
			},
			isAffix: {
				name: "是否固定",
				immobilization: "固定",
				msg: "固定后在面包屑无法被关闭",
			},
			isFullPage: {
				name: "是否整页打开",
				pageOpen: "整页打开",
				msg: "是否整页打开路由（脱离框架系）",
			},
		},
	},
	role: {
		permissionSetting: "权限设置",
		rolePermissionSettings: "角色权限设置",
		roleName: "角色名称",
		menuPermissions: "菜单权限",
		form: {
			introduction: {
				name: "角色名称",
			},
			roles: {
				name: "角色别名",
			},
			createdAt: {
				name: "创建时间",
			},
			updatedAt: {
				name: "更新时间",
			},
		},
	},
	file_select: {
		allResources: "所有资源",
		localUpload: "本地上传",
		most: "上传文件大小不超过",
		error: "上传文件错误",
		search: "文件名搜索",
		group: "分组",
		noGroup: "未分组",
		newGrouping: "新建分组",
	},
	resource: {
		uploadTitle: "设置封面",
		descriptionsBasic: "基础信息",
		descriptionsResource: "资源信息",
		descriptionsItemName: "资源名称",
		descriptionsItemDepict: "资源别名",
		descriptionsItemType: "资源类型",
		descriptionsItemGroup: "资源分组",
		descriptionsItemUrl: "资源地址",
		descriptionsItemExtension: "资源后缀",
		descriptionsItemOriginalName: "资源原始名称",
		descriptionsItemOriginalType: "资源原始类型",
		descriptionsItemSize: "资源大小",
		descriptionsItemSpecification: "支持的规格",
		form: {
			depict: {
				name: "别名",
			},
		},
	},
	resource_type: {
		keyword: "资源分类名称",
		form: {
			uuid: {
				name: "uuid",
			},
			name: {
				name: "资源类型名称",
			},
			alias: {
				name: "资源类型别名",
				msg: "唯一且只能是字母",
			},
			icon: {
				name: "资源类型图标",
			},
			size: {
				name: "资源类型大小",
				msg: "不配置则不限制，单位B",
			},
			extension: {
				name: "资源类型后缀",
				msg: "不配置则不限制，文件后缀名，如png，回车添加",
			},
			specification: {
				name: "资源类型规格",
				msg: "图片规格，如150，回车添加，仅支持图片",
			},
			createdAt: {
				name: "创建时间",
			},
			updatedAt: {
				name: "更新时间",
			},
		},
	},
	admin: {
		button: {
			password: "密码重置",
		},
		FilterBarName: "管理员筛选",
		search: "账号 / 真实姓名 / 手机",
	},
};
