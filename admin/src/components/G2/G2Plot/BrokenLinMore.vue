<template>
  <div :id="id"/>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>

<script>
import { Line } from '@antv/g2plot'
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
      Line: null,
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
      if (this.Line === null) {
        this.Line = new Line(this.id, {
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
          yAxis: {
            label: {
              formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
            }
          },
          legend: {
            position: 'right-top'
          },
          seriesField: 'type',
          responsive: true
        })
        this.Line.render()
      } else {
        this.Line.changeData(data)
      }
    }
  }
}
</script>
