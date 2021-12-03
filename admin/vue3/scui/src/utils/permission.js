import tool from '@/utils/tool';

export function permission(data) {
	let permissions = tool.data.get("PERMISSIONS");
	if(!permissions){
		return false;
	}
	let isHave = permissions.includes(data);
	return isHave;
}

export function rolePermission(data) {
	let userInfo = tool.data.get("USER_INFO");
	if(!userInfo){
		return false;
	}
	let role = userInfo.role;
	if(!role){
		return false;
	}
	let isHave = role.includes(data);
	return isHave;
}
