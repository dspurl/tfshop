import {authorization} from '@/api/user'
export default {
  middleware: 'auth',
  data() {
    return {
      menuActive: -1,
      copyright: '1'
    }
  },
  computed: {
    menuList() {
      return [
        {
          name: this.$t('header.top.personal_center'),
          children: [
            { name: this.$t('user.centre'), path: '/user/portal', active: false },
            { name: this.$t('header.top.message'), path: '/user/notice/list', active: false},
            { name: this.$t('header.top.collection'), path: '/user/collect', active: false},
            { name: this.$t('user.site'), path: '/user/address', active: false},
            { name: this.$t('user.bill'), path: '/user/finance/list', active: false}
          ]
        },
        {
          name: this.$t('user.order'),
          children: [
            { name: this.$t('header.top.order'), path: '/user/indent/list', active: false }
          ]
        },
        {
          name: this.$t('user.account'),
          children: [
            { name: this.$t('user.info'), path: '/user/userinfo', active: false },
            { name: this.$t('user.cellphone'), path: '/user/cellphone', active: false },
            { name: this.$t('user.cancel'), path: '/user/cancel', active: false}
          ]
        }
      ]
    }
  },
  mounted() {
    this.getAuthorization();
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.setMenuActive(val.path)
      },
      deep: true
    }
  },
  methods: {
    async getAuthorization(){
      authorization().then(response => {
        this.copyright = response
      })
    },
    setMenuActive(path) {
      if($nuxt.$i18n.getLocaleCookie() !== 'ch'){
        path = path.replace(`/${$nuxt.$i18n.getLocaleCookie()}`,'')
      }
      for (let i = 0; i < this.menuList.length; i++) {
        if(this.menuList[i].children.length>0){
          for (let j = 0; j < this.menuList[i].children.length; j++) {
            // if (this.menuList[i].children[j].path.split('\/')[2] === path.split('\/')[2]) {
            if (this.menuList[i].children[j].path === path) {
              this.menuList[i].children[j].active = true
            } else {
              this.menuList[i].children[j].active = false
            }
          }
        }
      }
      this.$forceUpdate()
    }
  }
}
