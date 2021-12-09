export default {
	general: {
		keywordFiltering: "Enter the keyword for filtering",
		refreshMenu: "To refresh the menu",
		unnamed: "Unnamed",
		selectDelete: "Select the item that you want to delete",
		delete: "Delete",
		deleteSuccessfully: "Delete Successfully",
		confirmDeleteMenu: "Are you sure to delete the selected menu?",
		deleteSelectedAndChild:
			"Are you sure to delete the selected {Number} item?Delete items that contain subsets will be deleted altogether",
		hint: "Hint",
		retrieveMenu:
			"In the retrieve menu, please do not operate and wait patiently~",
		saveSuccessfully: "Save Successfully",
		operateSuccessfully: "Operate Successfully",
		save: "Save",
		cancel: "Cancel",
		operation: "Operation",
		view: "View",
		edit: "Edit",
		add: "Add",
		sureDelete: "Are you sure?",
		pleaseInput: "Please input",
		pleaseSelect: "Please select",
		formatWrong: "The format is wrong"
	},
	setting: {
		form: {
			colorPrimary: {
				name: "Theme colors",
			},
			layout: {
				name: "Frame layout",
				placeholder: "Please choose",
				default: "Default",
				header: "Banner",
				classics: "Classics",
				functionDock: "Function dock",
			},
			menuIsCollapse: {
				name: "Function dock",
			},
			layoutTags: {
				name: "Tab bar",
			},
		},
	},
	login: {
		slogan: "High performance / delicate / grace",
		describe:
			"Vue3 + element plus based front-end solutions in the background.",
		signInTitle: "Sign in",
		rememberMe: "Remember me",
		forgetPassword: "Forget password",
		signIn: "Sign in",
		signInOther: "Sign in with",
		userPlaceholder: "user / phone / email",
		userError: "Please input a user name",
		PWPlaceholder: "Please input a password",
		PWError: "Please input a password",
		admin: "Administrator",
		user: "User",
		succeed: "Login Success",
	},
	user: {
		dynamic: "Dynamic",
		info: "User Info",
		settings: "Settings",
		nightmode: "night mode",
		nightmode_msg:
			"Suitable for low light environment,The current night mode is beta",
		language: "language",
		language_msg:
			"Translation in progress,Temporarily translated the text of this view",
	},
	power: {
		selectLeftMenuOperate: "Please select the menu on the left to operate",
		newMenu: "New menu",
		form: {
			title: {
				name: "Display Name",
				placeholder: "Menu display name",
			},
			pid: {
				name: "Previous Menu",
				placeholder: "Top menu",
				msg: "Make sure there are subclasses for menu, otherwise permissions will not be added",
			},
			type: {
				name: "Type",
				label: {
					menu: "Menu",
					iframe: "Iframe",
					link: "Link",
					button: "Button",
				},
			},
			api: {
				name: "Alias",
				placeholder: "Menu alias",
				msg: "The system is unique and consistent with the name of the built-in component; otherwise, the cache will be invalid.This field can be used for permission judgment;If the menu type is Iframe, the alias will be displayed in the address bar instead of the source address",
			},
			icon: {
				name: "menu icon",
			},
			path: {
				name: "RLOC",
				placeholder: "The routing address",
			},
			redirectUrl: {
				name: "Redirect",
			},
			active: {
				name: "Menu Highlighting",
				msg: "The parent menu routing address that the child node or detail page needs to highlight",
			},
			view: {
				name: "View",
				msg: "Menus without views, such as parent nodes, links, or Iframe, do not need to be filled in",
			},
			color: {
				name: "Colour",
			},
			isHidden: {
				name: "Hidden",
				hiddenMenu: "Hidden menu",
				hideCrumbs: "Hide crumbs",
				msg: "Menus are not displayed in the navigation, but can still be accessed by the user, such as the details page",
			},
			isAffix: {
				name: "Fixed",
				immobilization: "immobilization",
				msg: "After fixing the breadcrumbs cannot be closed",
			},
			isFullPage: {
				name: "Whether Entire Page Open",
				pageOpen: "A full page open",
				msg: "Whether to open routing in whole page (out of frame)",
			},
		},
	},
	role: {
		permissionSetting: "Permission Setting",
		rolePermissionSettings: "Role Permission Settings",
		roleName: "Role Name",
		menuPermissions: "Menu Permissions",
		form: {
			introduction: {
				name: "Character Name",
			},
			roles: {
				name: "Role Alias",
			},
			createdAt: {
				name: "Created Time",
			},
			updatedAt: {
				name: "Update Time",
			},
		},
	},
	resource_type: {
		keyword: "Resource Category Name",
		form: {
			uuid: {
				name: "UUID",
			},
			name: {
				name: "Resource Type Name",
			},
			alias: {
				name: "Resource Type Alias",
				msg: "Only and only letters",
			},
			icon: {
				name: "Resource Type Icon",
			},
			size: {
				name: "Resource Type Size",
				msg: "If this parameter is not configured, the unit is B",
			},
			extension: {
				name: "Resource Type Suffix",
				msg: "File name extension, such as PNG, can be added by press Enter",
			},
			specification: {
				name: "Resource Type Specifications",
				msg: "Image specifications, such as 150, press Enter to add, only image support",
			},
			createdAt: {
				name: "Created Time",
			},
			updatedAt: {
				name: "Update Time",
			},
		},
	},
};
