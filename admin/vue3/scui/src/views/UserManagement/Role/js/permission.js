export default {
    emits: ['success', 'closed'],
    data() {
        return {
            visible: false,
            isSaveing: false,
            id: 0,
            menu: {
                list: [],
                checked: [],
                props: {
                    label: (data)=>{
                        return data.title
                    }
                }
            },
            group: {
                list: [],
                checked: [],
                props: {}
            },
            type: {
                list: [],
                checked: [],
                props: {}
            },
            dashboard: "0",
            dashboardOptions: [
                {
                    value: '0',
                    label: '数据统计',
                    views: 'stats'

                },
                {
                    value: '1',
                    label: '工作台',
                    views: 'work'
                },
            ]
        }
    },
    mounted() {
    },
    methods: {
        open(id,checked=[]){
            this.visible = true;
            this.id = id
            this.menu.checked = checked
            return this
        },
        async submit(){
            this.isSaveing = true;
            try{
                await this.$API.role.permission.post(this.id, {ids:this.$refs.menu.getCheckedKeys().concat(this.$refs.menu.getHalfCheckedKeys())});
                this.visible = false;
                this.$message.success("操作成功")
                this.$emit('success')
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
            }finally{
                this.isSaveing = false;
            }
        },
        //注入数据
        setData(data){
            this.menu.list = data;
        }
    }
}