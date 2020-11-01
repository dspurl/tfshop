<template>
  <detail :is-edit="true"/>
</template>

<script>
import Detail from './components/Detail'
export default {
  name: 'EditArticle',
  components: { Detail }
}
</script>

