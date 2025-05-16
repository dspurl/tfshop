##基础
```vue
#图标
<el-icon><el-icon-close/></el-icon>
<el-icon><component :is="'el-icon-delete'"/></el-icon>
#跳转后刷新
this.$router.push({
	path: '/FinalTransaction/FinalTransactionDispose'
})
this.$route.is = true
```
##扩展
- 引入 lodash，可使用更多的方法和函数
- https://www.lodashjs.com/
```js
#直接使用
this.$LODASH.clamp(-10, -5, 5)
```
## 组件说明
> 后台负责外壳及右边，iframe中的代码在前端代码中
> 
> widgets只用了component.json，其它的后期看能不删除
> 
> dsCustomSchemaTemplate是右边的组件
> 
> 流程:ControlWidgets(widgets)->ControlPanel(iframe)->ControlConfig(dsCustomSchemaTemplate)
## 修改说明
- this.control.curPage替换成this.$store.state.global.curPage
