export default {
    emits: ['success', 'closed'],
    data() {
        return {
            visible: false,
            isSaveing: false,
            menu: {
                list: [],
                checked: ["test", "system", "user", "role"],
                props: {
                    label: (data)=>{
                        return data.meta.title
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
        this.getMenu();
    },
    methods: {
        open(){
            this.visible = true;
        },
        submit(){
            this.isSaveing = true;
            setTimeout(()=>{
                this.isSaveing = false;
                this.visible = false;
                this.$message.success("操作成功")
                this.$emit('success')
            },1000)
        },
        async getMenu(){
            var res = await this.$API.system.menu.list.get();
            this.menu.list = res.data;
        }
    }
}