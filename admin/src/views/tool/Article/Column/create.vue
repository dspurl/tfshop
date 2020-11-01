<template>
  <detail :is-edit="false"/>
</template>

<script>
import Detail from './components/Detail'

export default {
  name: 'CreateColumn',
  components: { Detail }
}
</script>

