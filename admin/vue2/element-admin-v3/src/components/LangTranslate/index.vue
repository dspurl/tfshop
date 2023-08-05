<template>
  <div>
    <el-button v-for="(item, index) in $store.state.app.lang_list" :disabled="$store.state.app.language === item.code" :key="index" :type="isTranslate(item) ? 'primary' : ''" size="mini" @click="handleClick(item)">
      {{ item.name }}
      <i v-if="$store.state.app.language !== item.code" :class="isTranslate(item) ? 'el-icon-edit' : 'el-icon-circle-plus-outline'" class="el-icon--right"/>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    isTranslate(item) {
      return this.value.language.find(function(element) {
        return element.lang === item.code
      })
    },
    handleClick(item) {
      this.$emit('translate', this.isTranslate(item), {
        lang_parent_id: this.value.id,
        lang: item.code
      })
    }
  }
}
</script>
