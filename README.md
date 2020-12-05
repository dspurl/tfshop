<p align="center">
  <img src="https://dspurl.github.io/image/dsshop_logo.jpg" width="150">
</p>
<p align="center">
  <a href="https://github.com/laravel/framework">
    <img src="https://img.shields.io/badge/laravel-7.22.4-brightgreen.svg" alt="laravel">
  </a>
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.5.17-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.9.1-brightgreen.svg" alt="element-ui">
  </a>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>
<h3 align="center">DSHOP电商商城</h3>
<p align="center">前后端分离架构，VUE2.0+Laravel7，免费开源可商用。</p>

说明
------------
<p>如果因网络原因无法下载，可通过<a href="https://gitee.com/dswjcms/dsshop">https://gitee.com/dswjcms/dsshop</a>下载</p>
<p>已验证版本(经测试后可以正常安装的版本):1.3.2</p>
介绍
------------
Dsshop是一个商城解决方案，它采用前后端分离，后端基于laravel,前端基于Vue，我们不生成代码，我们只是代码的搬运工，60%的复制粘贴，30%的思考，10%的代码量。
> 本项目的定位是商城集成方案，不太适合当基础底层来进行二次开发。因为本项目集成了很多你可能用不到的功能，会造成不少的代码冗余。如果你的项目不关注这方面的问题，也可以直接基于它进行二次开发。
> 
> 本项目入门不难，不会编程也可以正常搭建属于自己的商城，深入会需要同时掌握VUE、JS、HTML、H5、Laravel、小程序、uni-app
> 
> 本项目比较适合个人（全栈）和小团队，中大型团队没有实践经验。

演示
------------
- 后台演示地址：<a href="http://dsshop.dswjcms.com/admin">http://dsshop.dswjcms.com/admin</a> 用户名：admin 密码: admin
- h5、小程序演示
<p align="center">
  <img src="https://dspurl.github.io/image/gh_e79e7cd855e7_258.jpg">
  <img src="https://dspurl.github.io/image/13.png">
</p>

要求
------------
 - php >= 7.2.5
 - laravel = 7.22.4
 - mysql >= 5.7
 - vue = 2.5.17

安装
------------
```shell
# 下载dsshop
git clone https://github.com/dspurl/dsshop.git
# 搭建json API
cd ./api
composer install
# 修改.env.dev为.env
# 添加数据库信息
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=表名
DB_USERNAME=用户名
DB_PASSWORD=密码

#配置redis(需要事先装redis服务端)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD='密码'
REDIS_PORT='端口'
REDIS_DB=1
REDIS_CACHE_DB=1

php artisan migrate
# 加载demo数据(demo和pure二选一)
php artisan generate:demo
# 加载纯净数据
# php artisan generate:pure
php artisan storage:link
# 生成APP_KEY
php artisan key:generate
# 生成oauth文件
php artisan passport:keys
# 创建密码授权客户端
php artisan passport:client --password
# 选择`admins`
#修改.env.dev为.env，添加OAuth认证信息
PASSPORT_CLIENT_ID="生成的Client ID"
PASSPORT_CLIENT_SECRET="生成的 Client secret"

# 搭建后台
cd ../admin
#不要在linux下执行，会报错，推荐windows
npm install 
#admin/config/dev.env.js修改自己的api地址
BASE_API: '"http://dsshop.com/api/v1/admin/"',

npm run dev

# 搭建H5
cd ../trade/Dsshop
npm install 
# HBuilder X导入trade/Dsshop目录
#trade/Dsshop/utils/config.js修改服务器地址
#修改`BaseURL`为API访问地址
#修改`secret`为API密钥'API的.env中的APP_KEY'

```
常见错误
------------
<p><a href="https://dspurl.github.io/dsshop/guide/faq.html">https://dspurl.github.io/dsshop/guide/faq.html</a></p>
<p><a href="https://dswjcms_purl.gitee.io/dsshop/guide/faq.html">https://dswjcms_purl.gitee.io/dsshop/guide/faq.html</a></p>

文档
------------
<p><a href="https://dspurl.github.io/dsshop/">https://dspurl.github.io/dsshop/</a></p>
<p><a href="https://dswjcms_purl.gitee.io/dsshop/">https://dswjcms_purl.gitee.io/dsshop/</a></p>

插件
------------
<p>下载请切换至<a href="https://github.com/dspurl/plugin">插件列表</a></p>
<p>优惠券</p>
<p>评价</p>
<p>栏目文章</p>
<p>分销功能</p>



功能介绍
------------
- **RBAC权限** 支持为不同管理员分配不同的权限
- **商品SKU** 支持为同一商品添加不同的SKU属性（设计为无限层，建议三级以内，层级越多，性能越差）
- **运费模板** 可以根据不同地区设置不同的运费和免邮的区域
- **购物车** 用户可以直接购买商品，也可以将商品添加到购物车，一起支付
- **订单** 项目支持用户下单、取消订单、平台发货、平台退款
- **授权登录** 支持小程序端手机号一键授权登录，默认支持微信小程序（其它小程序可参考文档快速接入）
- **支付** 支持余额支付（暂时只支持退款入账，不支持后台添加用户余额）和在线支付（默认支持微信小程序支付，其它支付可参考文档快速接入）
- **轮播** 可以为项目添加轮播和首页广告，并添加相应的URL
- **模板通知** 集成微信小程序模板通知，平台发货时，用户将收到发货的模板通知
- **短信验证码** 集成阿里云短信，用户注册、找回密码时需要用户获取短信完成验证(未配置短信时，用户点击获取验证码后，将自动填写验证码)
- **统计** 接入微信小程序部分统计，结合项目本身数据统计，让你全方位了解项目的真实数据
- **事务支持** 项目支持事务处理，并为必要的业务流程增加了事务的处理机制
- **Redis支持** 项目部分数据采用Redis缓存和Redisis锁机制
- **消息通知** 支持数据库通知功能，可快速集成到各个业务场景中

图标
------------
- 后端使用svg图标，路径在`admin/src/icons/svg`，根据文件名可以看出图标用途
- 前端使用了用了1个ttf图标文件(https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf)
- 在App.vue中引用，用[百度字体编辑器](http://fontstore.baidu.com/static/editor/index.html)可以查看和编辑字体
- 预览使用: https://vkceyugu.cdn.bspapp.com/VKCEYUGU-market/872f2160-d6e1-11ea-81ea-f115fe74321c.html

基于以下扩展或组件(不分排名，这里只罗列部分名称，具体请查看package和composer)
------------
- [laravel](https://learnku.com/docs/laravel/7.x "laravel")
- [easywechat](https://www.easywechat.com/docs/4.1/mini-program/app_code "easywechat微信公众号")
- [guzzle](https://guzzle-cn.readthedocs.io/zh_CN/latest/index.html "guzzle")
- [Passport OAuth 认证](https://learnku.com/docs/laravel/7.x/passport/7515 "Passport OAuth 认证")
- [vue2.0](https://cn.vuejs.org/v2/guide/ "vue")
- [ColorUI](https://github.com/weilanwl/ColorUI "ColorUI")
- [uni-app](https://uniapp.dcloud.io/README "uni-app")
- [vue-element-admin V3.*](https://github.com/PanJiaChen/vue-element-admin/blob/tag/3.11.0/README.zh-CN.md "vue-element-admin")
- [element](https://element.eleme.cn/ "element")


加入我们
------------
- 有问题可以直接issue，请详细说明问题。
- 如果你想贡献代码或反馈BUG，扫码进群（不提供问题解答，问题一律只通过issue处理）
<p align="center">
  <img src="https://dspurl.github.io/image/12.png" width="150">
</p>
