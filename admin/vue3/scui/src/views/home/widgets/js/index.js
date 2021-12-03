import draggable from 'vuedraggable'
import allComps from '../components'

export default {
    components: {
        draggable
    },
    data() {
        return {
            customizing: false,
            allComps: allComps,
            selectLayout: [],
            defaultGrid: {
                layout: [12, 6, 6],
                copmsList: [
                    ['welcome'],
                    ['about', 'ver'],
                    ['time', 'progress']
                ]
            },
            grid: []
        }
    },
    created(){
        this.grid = this.$TOOL.data.get("grid") || this.defaultGrid
    },
    mounted() {
        this.$emit('on-mounted')
    },
    computed: {
        allCompsList(){
            var allCompsList = []
            for(var key in this.allComps){
                allCompsList.push({
                    key: key,
                    title: allComps[key].title,
                    icon: allComps[key].icon,
                    description: allComps[key].description
                })
            }
            var myCopmsList = this.grid.copmsList.reduce(function(a, b){return a.concat(b)})
            for(let comp of allCompsList){
                const _item = myCopmsList.find((item)=>{return item === comp.key})
                if(_item){
                    comp.disabled = true
                }
            }
            return allCompsList
        },
        myCompsList(){
            return this.allCompsList.filter(item => !item.disabled )
        },
        nowCompsList(){
            return this.grid.copmsList.reduce(function(a, b){return a.concat(b)})
        }
    },
    methods: {
        //开启自定义
        custom(){
            this.customizing = true
            const oldWidth = this.$refs.widgets.offsetWidth
            this.$nextTick(() => {
                const scale =  this.$refs.widgets.offsetWidth / oldWidth
                this.$refs.widgets.style.setProperty('transform', `scale(${scale})`)
            })
        },
        //设置布局
        setLayout(layout){
            this.grid.layout = layout
            if(layout.join(',')=='24'){
                this.grid.copmsList[0] = [...this.grid.copmsList[0],...this.grid.copmsList[1],...this.grid.copmsList[2]]
                this.grid.copmsList[1] = []
                this.grid.copmsList[2] = []
            }
        },
        //追加
        push(item){
            let target = this.grid.copmsList[0]
            target.push(item.key)
        },
        //隐藏组件
        remove(item){
            var newCopmsList = this.grid.copmsList
            newCopmsList.forEach((obj, index) => {
                var newObj = obj.filter(o=>o!=item)
                newCopmsList[index] = newObj;
            })
        },
        //保存
        save(){
            this.customizing = false
            this.$refs.widgets.style.removeProperty('transform')
            this.$TOOL.data.set("grid", this.grid)
        },
        //恢复默认
        backDefaul(){
            this.customizing = false
            this.$refs.widgets.style.removeProperty('transform')
            this.grid =  JSON.parse(JSON.stringify(this.defaultGrid))
            this.$TOOL.data.remove("grid")
        },
        //关闭
        close(){
            this.customizing = false
            this.$refs.widgets.style.removeProperty('transform')
        }
    }
}