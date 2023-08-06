<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, index) in languageList" :key="index" :disabled="language === item.code" :command="item.code">
        {{ item.name }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { lang } from '@/api/language'
export default {
  data() {
    return {
      languageList: []
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    this.getLanguage()
  },
  methods: {
    getLanguage() {
      lang().then(response => {
        this.languageList = response.data
        this.$store.dispatch('setLangList', this.languageList)
      })
    },
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: this.$t('switch.language'),
        type: 'success'
      })
      this.$router.go(0)
    }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}
</style>

