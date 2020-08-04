<p align="center">
  <img src="https://dspurl.github.io/dsshop_logo.jpg" width="150">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>
<h3 align="center">DSHOP电商商城</h3>
<p align="center">前后端分离架构，VUE2.0+Laravel7，免费开源可商用。</p>

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
  <img src="https://dspurl.github.io/gh_e79e7cd855e7_258.jpg">
  <img src="https://dspurl.github.io/13.png">
</p>

要求
------------
 - php >= 7.2.5
 - laravel = 7.22.4
 - mysql > 5.2
 - vue = 2.5.17
 
安装
------------
```shell
# 下载dsshop
git clone https://github.com/dspurl/dsshop.git
# 搭建json API
cd ./api
composer install
#修改.env.dev为.env，添加数据库信息
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=表名
DB_USERNAME=用户名
DB_PASSWORD=密码

php artisan migrate
# 加载demo数据(demo和pure二选一)
php artisan generate:demo
# 加载纯净数据
# php artisan generate:pure
# 搭建后台
cd ../admin
npm install
## 配置json API地址
npm run dev
# 搭建H5/小程序
# HBuilder X导入trade\Dsshop
## 配置json API地址
```
文档
------------
<a href="https://dspurl.github.io/dsshop/">https://dspurl.github.io/dsshop/</a>
 
功能介绍
------------
- **RBAC权限** 支持为不同管理员分配不同的权限
- **商品SKU** 支持为同一商品添加不同的SKU属性（设计为无限层，建议三级以内，层级越多，性能越差）
- **运费模板** 可以根据不同地区设置不同的运费和免邮的区域
- **购物车** 用户可以直接购买商品，也可以将商品添加到购物车，一起支付
- **订单** 项目支持用户下单、取消订单、平台发货、平台退款
- **支付** 项目支持“余额支付”和“在线支付”模式，在线支付暂时只支持微信支付（微信支付现只能通过微信小程序唤起支付）
- **轮播** 可以为项目添加轮播和首页广告，并添加相应的URL
- **模板通知** 集成微信小程序模板通知，平台发货时，用户将收到发货的模板通知
- **短信验证码** 集成阿里云短信，用户注册、找回密码时需要用户获取短信完成验证(未配置短信时，用户点击获取验证码后，将自动填写验证码)
- **统计** 接入微信小程序部分统计，结合项目本身数据统计，让你全方位了解项目的真实数据
- **事务支持** 项目支持事务处理，并为必要的业务流程增加了事务的处理机制
- **Redis支持** 项目部分数据采用Redis缓存和Redisis锁机制

基于以下扩展或组件
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
- 欢迎laravel或vue爱好者加入，一个人力量有限。
- 有问题可以直接issue或扫码进微信群。
- 扫码进群
<p align="center">
  <img src="https://dspurl.github.io/12.png" width="150">
</p>