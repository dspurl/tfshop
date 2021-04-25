<template>
  <div class="box">
    <address-list/>
  </div>
</template>

<script>
import addressList from '@/components/Address/list'
export default {
  layout: 'user',
  components: {
    addressList
  },
  head () {
    return {
      title: '地址管理-个人中心',
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
</script>
