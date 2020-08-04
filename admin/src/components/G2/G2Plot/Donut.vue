<template>
  <div :id="id"/>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>

<script>
import { Donut } from '@antv/g2plot'
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
      donutPlot: null,
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
      if (this.donutPlot) {
        this.donutPlot.destroy()
      }
      this.donutPlot = new Donut(this.id, {
        height: this.height,
        width: this.width,
        title: {
          visible: true,
          text: this.title
        },
        forceFit: true,
        radius: 0.8,
        padding: 'auto',
        data,
        angleField: 'value',
        colorField: 'name',
        statistic: {
          visible: false
        }
      })
      this.donutPlot.render()
    }
  }
}
</script>
