<template>
  <div :id="id"/>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>

<script>
import { Column } from '@antv/g2plot'
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
      columnPlot: null,
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
      if (this.columnPlot === null) {
        this.columnPlot = new Column(this.id, {
          height: this.height,
          width: this.width,
          title: {
            visible: true,
            text: this.title
          },
          padding: 'auto',
          forceFit: true,
          data,
          xField: 'type',
          yField: 'value',
          meta: {
            type: {
              alias: '类别'
            },
            value: {
              alias: '访问量'
            }
          },
          label: {
            visible: true,
            style: {
              fill: '#0D0E68',
              fontSize: 12,
              fontWeight: 600,
              opacity: 0.6
            }
          }
        })
        this.columnPlot.render()
      } else {
        this.columnPlot.changeData(data)
      }
    }
  }
}
</script>
