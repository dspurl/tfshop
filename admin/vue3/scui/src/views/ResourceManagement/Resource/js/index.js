import scFileSelect from '@/components/scFileSelect'
export default {
    name: 'Resource',
    components: {
        scFileSelect
    },
    data() {
        return {
            file: '',
            multiple: false,
            hideUpload: false,
            upload: '',
            upload2: ''
        }
    },
    mounted() {

    },
    methods: {
        submit(value){
            console.log(value)
            this.$message("返回值请查看F12控制台console.log()")
        }
    }
}