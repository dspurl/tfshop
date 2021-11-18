<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="activeMenu"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    activeMenu() {
      const route = this.$route
      const { path } = route
      if (path.indexOf('Create') !== -1 || path.indexOf('Detail') !== -1 || path.indexOf('Edit') !== -1) {
        let name = path.split('/')
        name[name.length - 1] = name[name.length - 1].charAt(0).toLowerCase() + name[name.length - 1].slice(1)
        name = name.join('/')
        if (path.indexOf('Create') !== -1) {
          return name.replace('Create', 'List')
        } else if (path.indexOf('Detail') !== -1) {
          return name.replace('Detail', 'List')
        } else {
          return name.replace('Edit', 'List')
        }
      } else {
        return path
      }
    }
  }
}
</script>
