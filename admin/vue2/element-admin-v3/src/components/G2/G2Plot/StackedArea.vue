<template>
  <div :id="id"/>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>

<script>
import { StackedArea } from '@antv/g2plot'
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
      areaPlot: null,
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
      if (this.areaPlot === null) {
        this.areaPlot = new StackedArea(this.id, {
          height: this.height,
          width: this.width,
          title: {
            visible: true,
            text: this.title
          },
          padding: 'auto',
          forceFit: true,
          data,
          xField: 'date',
          yField: 'value',
          stackField: 'country',
          yAxis: {
            type: 'dateTime',
            tickCount: 5
          },
          legend: {
            visible: true,
            position: 'right-top'
          },
          responsive: true
        })
        this.areaPlot.render()
      } else {
        this.areaPlot.changeData(data)
      }
    }
  }
}
</script>
