export default {
	state: {
		//移动端布局
		ismobile: false,
		//布局
		layout: process.env.VUE_APP_LAYOUT,
		//菜单是否折叠 toggle
		menuIsCollapse: process.env.VUE_APP_MENU_IS_COLLAPSE === 'true',
		//多标签栏
		layoutTags: process.env.VUE_APP_LAYOUT_TAGS === 'true',
		//主题
		theme: '',
	},
	mutations: {
		SET_ismobile(state, key){
			state.ismobile = key
		},
		SET_layout(state, key){
			state.layout = key
		},
		SET_theme(state, key){
			state.theme = key
		},
		TOGGLE_menuIsCollapse(state){
			state.menuIsCollapse = !state.menuIsCollapse
		},
		TOGGLE_layoutTags(state){
			state.layoutTags = !state.layoutTags
		}
	}
}
