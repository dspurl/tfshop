export default{
  name: 'DefaultColumn',
  props: {
    data: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    listQuery: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
    };
  },
  watch: {
  },
  mounted() {

  },
  methods:{
    getList(){
      this.$emit('getList')
    }
  },
}
