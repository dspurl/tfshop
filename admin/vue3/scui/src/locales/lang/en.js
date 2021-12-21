export default {
	general: {
		keywordFiltering: "Enter the keyword for filtering",
		refreshMenu: "To refresh the menu",
		unnamed: "Unnamed",
		selectDelete: "Select the item that you want to delete",
		delete: "Delete",
		deleteSuccessfully: "Delete Successfully",
		confirmDeleteMenu: "Are you sure to delete the selected menu?",
		confirmDeleteProject: "Are you sure to delete the selected {length} item?",
		deleteSelectedAndChild:
			"Are you sure to delete the selected {Number} item?Delete items that contain subsets will be deleted altogether",
		hint: "Hint",
		retrieveMenu:
			"In the retrieve menu, please do not operate and wait patiently~",
		saveSuccessfully: "Save Successfully",
		operateSuccessfully: "Operate Successfully",
		save: "Save",
		confirm: "Confirm",
		cancel: "Cancel",
		operation: "Operation",
		view: "View",
		edit: "Edit {msg}",
		preview: "Preview",
		add: "Add {msg}",
		sureDelete: "Are you sure?",
		pleaseInput: "Please input {msg}",
		pleaseSelect: "Please select {msg}",
		formatWrong: "The format is wrong",
		nothing: "Nothing",
		noData: "No Data",
		rename: "Rename",
		ack: "Enter your keywords and press Enter to confirm",
		all: "All",
		copy: "Copy",
		copying: "Copying",
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
	config: {
		filterBar: {
			operator: {
				eq: "Equal",
				neq: "Not equal",
				gt: "Greater",
				gte: "Great than or equal",
				lt: "Less than",
				le: "Less than or equal to",
				include: "Include",
				notinclude: "Not include",
			},
		},
	},
	request: {
		error: "Request error",
		unknownError: "Unknown error",
		noResponse: "Request server is not responding!",
		reLogin: {
			title: "Confirm quit",
			info: "Long time no operation, you have been logged out, you can cancel to continue to stay in the page, or log in again",
			confirmButtonText: "Re Login",
			cancelButtonText: "Cancel",
		},
		reRefresh: {
			info: "Your TOKEN is invalid, it has been updated, please resubmit",
		},
		404: "Requesting a nonexistent server record!",
		500: "Server error!",
	},
	form: {
		date: "Date",
		startDate: "Start date",
		endDate: "End date",
		password: {
			title: "Please enter your login password",
			title2: "Please enter your password again",
			inconformity: "The two passwords are inconsistent!"
		}
	},
	filterBar: {
		common: {
			title: "My usual filter",
			no: {
				title: "There is no common filter",
				explain:
					"Common filtering can save multiple filtering conditions as a set, facilitating the filtering of the same conditions next time",
			},
			del: "Are you sure to remove this common filter?",
		},
		index: {
			title: "Filter",
			project: "Each filter",
			conditionTitle: "Setting filter Conditions",
			conditionNoData:
				"There is no default filter criterion, click Add Filter",
			field: "Filter fields",
			operator: "Operator",
			add: "Adding filter items",
			immediately: "Filter immediately",
			saveMy: "Save as common (this account)",
			saveAll: "Save as common (all accounts)",
			empty: "Empty filter",
			nothing: "No filter item",
			prompt: {
				title: "Common filter name",
				inputTitle: "Save as common",
				inputPlaceholder: "Enter a common filter name with high recognition",
				inputErrorMessage: "The name cannot be empty",
			},
			succeed: "Common Use saved Successfully",
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
	file_select: {
		allResources: "All resources",
		most: "The size of the uploaded file does not exceed the upper limit ",
		localUpload: "Local Upload",
		error: "Uploading file error",
		search: "File name search",
		group: "Group",
		noGroup: "No Group",
		newGrouping: "New Grouping",
	},
	resource: {
		uploadTitle: "Set Cover",
		descriptionsBasic: "Basic Information",
		descriptionsResource: "Resource Information",
		descriptionsItemName: "Resource Name",
		descriptionsItemDepict: "Resources Alias",
		descriptionsItemType: "Resource Type",
		descriptionsItemGroup: "Resource Group",
		descriptionsItemUrl: "Resources Url",
		descriptionsItemExtension: "Resources Suffix",
		descriptionsItemOriginalName: "Resources Original Name",
		descriptionsItemOriginalType: "Resources Original Type",
		descriptionsItemSize: "Resources Size",
		descriptionsItemSpecification: "Supported Specifications",
		form: {
			depict: {
				name: "Depict",
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
	admin: {
		button: {
			password: "Reset the password",
		},
		FilterBarName: "Administrator Filtering",
		search: "Account number/real name/mobile phone",
		passwordName: "Change password",
		password: "New password",
		password2: "Confirm password",
		user: "User",
		form: {
			name: {
				name: "Account",
				placeholder: "Log in to the system",
				msg: "An account cannot be modified after being created",
			},
			portrait: {
				name: "Portrait",
				label: {
					already: "have uploaded",
					no: "No upload"
				}
			},
			real_name: {
				name: "Real name",
				placeholder: "Please enter your full real name",
			},
			email: {
				name: "Email",
				placeholder: "Used to receive email notifications",
			},
			cellphone: {
				name: "Cellphone",
				placeholder: "Used to receive SMS notification",
			},
			password: {
				name: "Login password",
			},
			password2: {
				name: "Confirm password",
			},
			auth_group: {
				name: "Subordinate role",
			},
			relevance: {
				name: "Associated with the user",
			},
			state: {
				name: "State",
				label: {
					normal: "Allow",
					forbid: "No Access"
				}
			},
			created_at: {
				name: "Add time",
			},
			login_at: {
				name: "Private Date lastlogintime",
			},
			updated_at: {
				name: "Last operating time",
			},
		}
	},
	adminLog: {
		FilterBarName: "Filtering Administrator logs",
		infoName: "Log details",
		form: {
			admin: {
				name: "User",
			},
			header: {
				name: "Request header",
			},
			name: {
				name: "Name",
			},
			path: {
				name: "path",
			},
			url: {
				name: "Request URL",
			},
			method: {
				name: "Request method",
				label: {
					get: "GET",
					post: "POST"
				}
			},
			ip: {
				name: "Client IP",
			},
			param: {
				name: "Required parameter",
			},
			created_at: {
				name: "Response time",
			},
		}
	}
};
