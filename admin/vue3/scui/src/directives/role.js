import { rolePermission } from '@/utils/permission'

export default {
	mounted(el, binding) {
		const { value } = binding
		if(Array.isArray(value)){
			let ishas = false;
			value.forEach(item => {
				if(rolePermission(item)){
					ishas = true;
				}
			})
			if (!ishas){
				el.parentNode.removeChild(el)
			}
		}else{
			if(!rolePermission(value)){
				el.parentNode.removeChild(el);
			}
		}
	}
};
