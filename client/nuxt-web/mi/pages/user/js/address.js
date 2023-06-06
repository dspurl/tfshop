import addressList from '@/components/Address/list'
export default {
  layout: 'user',
  components: {
    addressList
  },
  head () {
    return {
      title: `${this.$t('user.site')}-${this.$t('header.top.personal_center')}`,
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {

  }
}
