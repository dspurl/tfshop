let newMenuIndex = 1;
import save from '../save'
export default {
    name: 'Power',
    components: {
        save
    },
    data(){
        return {
            menuloading: false,
            menuList: [],
            menuProps: {
                label: (data)=>{
                    return data.title
                }
            },
            menuFilterText: ""
        }
    },
    watch: {
        menuFilterText(val){
            this.$refs.menu.filter(val);
        }
    },
    mounted() {
        this.getMenu();
    },
    methods: {
        //加载树数据
        async getMenu(){
            this.menuloading = true
            const res = await this.$API.power.list.get();
            this.menuloading = false
            this.menuList = res.message
        },
        //树点击
        menuClick(data, node){
            const pid = node.level==1?undefined:node.parent.data.id;
            this.$refs.save.setData(data, pid)
            this.$refs.main.$el.scrollTop = 0
        },
        //树过滤
        menuFilterNode(value, data){
            if (!value) return true;
            let targetText = data.title;
            return targetText.indexOf(value) !== -1;
        },
        //树拖拽
        nodeDrop(draggingNode, dropNode, dropType){
            this.$refs.save.setData({})
            let form = draggingNode.data
            if (dropType === 'before') {    //之前
                form.sort = dropNode.data.sort + 1
            } else {
                form.sort = dropNode.data.sort - 1
            }
            form.pid = dropNode.data.pid
            this.$API.power.edit.post(form)
        },
        //增加
        async add(node, data){
            const newMenuName = "未命名" + newMenuIndex++;
            let newMenuData = {
                pid: data ? data.id : "",
                title: newMenuName,
                type: 1,
                sort: 5
            }
            this.menuloading = true
            const res = await this.$API.power.create.post(newMenuData)
            this.menuloading = false
            newMenuData = res.message

            this.$refs.menu.append(newMenuData, node)
            this.$refs.menu.setCurrentKey(newMenuData.id)
            const pid = node ? node.data.id : ""
            this.$refs.save.setData(newMenuData, pid)
        },
        //删除菜单
        async delMenu(){
            const CheckedNodes = this.$refs.menu.getCheckedNodes()
            if(CheckedNodes.length == 0){
                this.$message.warning("请选择需要删除的项")
                return false;
            }

            const confirm = await this.$confirm('确认删除已选择的菜单吗？','提示', {
                type: 'warning',
                confirmButtonText: '删除',
                confirmButtonClass: 'el-button--danger'
            }).catch(() => {})
            if(confirm != 'confirm'){
                return false
            }

            this.menuloading = true
            const reqData = {
                ids: CheckedNodes.map(item => item.id)
            }
            try {
                await this.$API.power.destroy.post(0,reqData)
                CheckedNodes.forEach(item => {
                    const node = this.$refs.menu.getNode(item)
                    if(node.isCurrent){
                        this.$refs.save.setData({})
                    }
                    this.$refs.menu.remove(item)
                })
            } finally {
                this.menuloading = false
            }
        },
        // 刷新菜单
        async refreshMenu(){
            const loading = this.$loading({
                lock: true,
                text: '重新获取菜单中，请不要操作，耐心等待~',
                background: 'rgba(255, 255, 255, 0.7)'
              })
            const getUserInfo = await this.$API.auth.getUserInfo.get()
            this.$TOOL.data.set("USER_INFO", getUserInfo.message.userInfo)
            this.$TOOL.data.set("MENU", getUserInfo.message.menu)
            this.$TOOL.data.set("PERMISSIONS", getUserInfo.message.permissions)
            this.$router.go(0)
            loading.close()
        }
    }
}