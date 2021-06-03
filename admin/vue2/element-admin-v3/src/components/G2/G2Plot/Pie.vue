<template>
  <div :id="id"/>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>

<script>
import { Pie } from '@antv/g2plot'
export default {
  props: {
    charData: {
      type: Array,
      default: function() {
        return {
          data: []
        }
      }
    },
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 500
    },
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      Pie: null,
      ds: null,
      dv: null
    }
  },
  watch: {
    charData: function(val, oldVal) {
      this.drawChart(val)
    }
  },
  methods: {
    drawChart: function() {
      const data = this.charData
      if (this.Pie) {
        this.Pie.destroy()
      }
      this.Pie = new Pie(this.id, {
        forceFit: true,
        width: this.width,
        height: this.height,
        title: {
          visible: true,
          text: this.title
        },
        radius: 0.8,
        data,
        angleField: 'value',
        colorField: 'name',
        label: {
          visible: true,
          type: 'inner'
        }
      })
      this.Pie.render()
    }
  }
}
</script>
