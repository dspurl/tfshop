export default {
    emits: ['success', 'closed'],
    data() {
        return {
            visible: false,
            isSaveing: false,
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
        open(checked=[]){
            this.visible = true;
            this.menu.checked = checked
            return this
        },
        submit(){
            this.isSaveing = true;
            console.log('this.$refs.tree.getCheckedNodes()',this.$refs.menu.getCheckedNodes())
            setTimeout(()=>{
                this.isSaveing = false;
                this.visible = false;
                this.$message.success("操作成功")
                this.$emit('success')
            },1000)
        },
        //注入数据
        setData(data){
            console.log('data', data)
            this.menu.list = data;
        }
    }
}