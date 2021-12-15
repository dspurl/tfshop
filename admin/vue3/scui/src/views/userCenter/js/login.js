import { getToken, setToken } from '@/utils/auth'
export default {
    data() {
        return {
            userType: 'admin',
            ruleForm: {
                username: "",
                password: "",
                remember: false,
                type: 1,
                refresh_token: ''
            },
            rules: {
                username: [
                    {required: true, message: this.$t('login.userError'), trigger: 'blur'}
                ],
                password: [
                    {required: true, message: this.$t('login.PWError'), trigger: 'blur'}
                ]
            },
            islogin: false,
            config: {
                lang: this.$TOOL.data.get('APP_LANG') || this.$ENV.VUE_APP_LANG,
                theme: this.$TOOL.data.get('APP_THEME') || 'default'
            },
            lang: [
                {
                    name: '简体中文',
                    value: 'cn',
                },
                {
                    name: 'English',
                    value: 'en',
                }
            ]
        }
    },
    watch:{
        // userType(val){
        // 	if(val == 'admin'){
        // 		this.ruleForm.user = 'admin'
        // 		this.ruleForm.password = 'admin'
        // 	}else if(val == 'user'){
        // 		this.ruleForm.user = 'user'
        // 		this.ruleForm.password = 'user'
        // 	}
        // },
        'config.theme'(val){
            document.body.setAttribute('data-theme', val)
            this.$TOOL.data.set("APP_THEME", val);
        },
        'config.lang'(val){
            this.$i18n.locale = val
            this.$TOOL.data.set("APP_LANG", val);
        }
    },
    created: function() {
        this.$TOOL.data.remove("TOKEN")
        this.$TOOL.data.remove("USER_INFO")
        this.$TOOL.data.remove("MENU")
        this.$TOOL.data.remove("PERMISSIONS")
        this.$TOOL.data.remove("APP_LANG")
        this.$TOOL.data.remove("grid")
        this.$store.commit("clearViewTags")
        this.$store.commit("clearKeepLive")
        this.$store.commit("clearIframeList")
    },
    methods: {
        async login(){
            const validate = await this.$refs.loginForm.validate().catch(()=>{})
            if(!validate){ return false }
            this.islogin = true
            try {
                const user = await this.$API.auth.login.post(this.ruleForm)
                const token = user.message
                let refresh_expires_in = 0
                // 处理登录状态
                if (getToken('access_token')) {
                    if ((new Date()).getTime() > getToken('expires_in')) { // token失效
                        this.ruleForm.type = 2
                        this.ruleForm.refresh_token = getToken('refresh_token')
                    }
                } else { // 第一次登录
                    this.ruleForm.type = 1
                }
                if (this.ruleForm.remember) {
                    refresh_expires_in = token.refresh_expires_in ? token.refresh_expires_in : 0
                }
                setToken('access_token', token.access_token, refresh_expires_in)
                setToken('expires_in', (new Date()).getTime() + token.expires_in * 1000, refresh_expires_in)
                setToken('refresh_token', token.refresh_token, refresh_expires_in)
                setToken('token_type', token.token_type, refresh_expires_in)
            } finally {
                this.islogin = false
            }
            try {
                const getUserInfo = await this.$API.auth.getUserInfo.get()
                this.$TOOL.data.set("USER_INFO", getUserInfo.message.userInfo)
                this.$TOOL.data.set("MENU", getUserInfo.message.menu)
                this.$TOOL.data.set("PERMISSIONS", getUserInfo.message.permissions)
            } finally {
                this.islogin = false
            }
            this.$router.replace({
                path: '/'
            })
            this.$message.success(this.$t('login.succeed'))
            this.islogin = false
        },
        configTheme(){
            this.config.theme = this.config.theme=='default'?'dark':'default'
        },
        configLang(command){
            this.config.lang = command.value
        }
    }
}