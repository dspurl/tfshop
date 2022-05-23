import {getList} from '@/api/seckill'
import moment from 'moment'
import CountDownTime from '../components/CountDownTime';
export default {
  components: { CountDownTime },
  data() {
    return {
      list: [],
      listQuery: {},
      loading: false,
      total: 0,
      time: 0,
      active: 0,
      times: []
    }
  },
  async asyncData(ctx) {
    try {
      let time = moment().format('YYYY-MM-DD HH:00:00')
      if(moment().format('HH')%2 !== 0){
        time = moment().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00')
      }
      let times = [{
        label: `${moment(time, "YYYY-MM-DD HH:00:00").format('H')}:00`,
        value: moment(time, "YYYY-MM-DD HH:00:00").format('YYYY-MM-DD HH:00:00'),
        active: true
      }, {
        label: `${moment(time, "YYYY-MM-DD HH:00:00").add(2, 'hour').format('H')}:00`,
        value: moment(time, "YYYY-MM-DD HH:00:00").add(2, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }, {
        label: `${moment(time, "YYYY-MM-DD HH:00:00").add(4, 'hour').format('H')}:00`,
        value: moment(time, "YYYY-MM-DD HH:00:00").add(4, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }, {
        label: `${moment(time, "YYYY-MM-DD HH:00:00").add(6, 'hour').format('H')}:00`,
        value: moment(time, "YYYY-MM-DD HH:00:00").add(6, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }, {
        label: `${moment(time, "YYYY-MM-DD HH:00:00").add(8, 'hour').format('H')}:00`,
        value: moment(time, "YYYY-MM-DD HH:00:00").add(8, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }]
      const listQuery = {
        limit: 20,
        page: 1,
        sort: 'id',
        time: time
      };
      let [data] = await Promise.all([
        getList(listQuery)
      ])
      return {
        times: times,
        list: data.data,
        total: data.total,
        listQuery: listQuery
      }
    } catch (err) {
      ctx.$errorHandler(err)
    }
  },
  created() {
    this.time = (moment(this.times[1].value).valueOf()-moment().valueOf())/1000
  },
  head() {
    return {
      title: '限时秒杀-' + process.env.APP_NAME,
      meta: [
        {hid: 'index', name: process.env.APP_NAME, content: process.env.APP_KEYWORD},
        {hid: 'description', name: 'description', content: process.env.APP_DESCRIPTION}
      ]
    }
  },
  methods: {
    getList() {
      this.loading = true;
      Promise.all([
        getList(this.listQuery)
      ]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    },
    // 切换菜单
    cutTab(index){
      this.active = index
      let time = this.times[index].value
      this.listQuery.time = this.times[index].value
      if(index === 0){
        this.listQuery.time = this.times[1].value
      }
      this.time = (moment(time).valueOf()-moment().valueOf())/1000
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList()
    },
    endTime(){
      this.$router.go(0)
    }
  }
}
