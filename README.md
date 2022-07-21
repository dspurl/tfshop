<p align="center">
  <img src="https://dspurl.github.io/image/dsshop_logo.jpg" width="150">
</p>
<p align="center">
  <a href="https://github.com/laravel/framework">
    <img src="https://img.shields.io/badge/laravel-7.30.6-brightgreen.svg" alt="laravel">
  </a>
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.5.17-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.13.2-brightgreen.svg" alt="element-ui">
  </a>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>
<h3 align="center">DSSHOP(DSSHOPING)电商商城</h3>
<p align="center">前后端分离架构，VUE2.0+Laravel7，免费开源可商用。</p>
<p align="center">官网: <a href="https://dsshoping.dswjcms.com" target="_blank">https://dsshoping.dswjcms.com</a></p>

更新说明
------------

说明
------------
<p>master分支为稳定版本，推荐大多数用户下载，new分支为新版本，随时会有更新，未进行测试验收，不推荐用户使用</p>
<p>如果因网络原因无法下载，可通过<a href="https://gitee.com/dswjcms/dsshop">https://gitee.com/dswjcms/dsshop</a>下载</p>
<p>当前版本3.0.3</p>

介绍
------------
DSSHOP是一套代代码多终端商城解决方案，它采用前后端分离，后端基于laravel,前端基于Vue。

我们不生成代码，我们只是代码的搬运工，60%的复制粘贴，30%的思考，10%的代码量。

演示
------------
- 后台演示地址：<a href="https://dsshop.dswjcms.com/admin">https://dsshop.dswjcms.com/admin</a>
- 网站演示地址：<a href="https://dsshop.dswjcms.com">https://dsshop.dswjcms.com</a>
- 小程序、h5、安卓演示（演示包含付费插件，开源以下载后功能为准）
<table>
    <tr>
    	<td><img src="https://dspurl.github.io/image/gh_e79e7cd855e7_258.jpg"></td>
        <td><img src="https://dspurl.github.io/image/13.png"></td>
        <td><img src="https://dspurl.github.io/image/1618405140569.png"></td>
    </tr>
</table>

兼容
------------
<table>
    <tr>
    	<th>网站</th>
        <th>管理后台</th>
        <th>H5</th>
        <th>小程序</th>
        <th>APP</th>
        <th>桌面</th>
    </tr>
    <tr>
        <td>支持（nuxt服务器渲染，SEO更友好）</td>
        <td>支持(基于vue-element-admin)</td>   
        <td>支持(uni-app)</td>
        <td>支持(除微信小程序外，其它的需要自行做兼容处理)</td>
        <td>支持(uni-app)</td>
        <td>支持(PWA)</td>
    </tr>
</table>

要求
------------
 - php >= 7.4
 - laravel = 7.22.6
 - mysql >= 5.7
 - vue = 2.5.17
 - node= 14.18.3

<p><a href="https://dspurl.github.io/dsshop/guide/getting-started.html#%E5%82%BB%E7%93%9C%E5%BC%8F%E5%AE%89%E8%A3%85%E5%8C%85">点击查阅详细步骤</a></p>

<p><a href="https://dswjcms_purl.gitee.io/dsshop/guide/getting-started.html#%E5%82%BB%E7%93%9C%E5%BC%8F%E5%AE%89%E8%A3%85%E5%8C%85">点击查阅详细步骤（上面访问慢的话，点击这里）</a></p>



傻瓜式一键安装(其它安装方式见文档)
------------

```shell
git clone https://gitee.com/dswjcms/dsshop.git
cd dsshop
# 配置伪静态(这里不做介绍，参考laravel)，最终能通过访问dsshop.test(这里必须可以通过dsshop.test访问，不然无法安装)访问到dsshop/public目录
# 运行安装引导
访问：http://dsshop.test/install
# 填写必要信息后，即可完成安装，安装只包括后台、h5、小程序
# 小程序可以直接用小程序开发工具打开dsshop/api/public/mp-weixin,打包好后的小程序无法使用地址配置的选择地址功能
# 网站需要进入dsshop/api/public/web并执行
npm install
npm start
```
常见错误
------------
<p><a href="https://dspurl.github.io/dsshop/guide/faq.html">https://dspurl.github.io/dsshop/guide/faq.html</a></p>
<p><a href="https://dswjcms_purl.gitee.io/dsshop/guide/faq.html">https://dswjcms_purl.gitee.io/dsshop/guide/faq.html</a></p>

文档
------------
<p><a href="https://dspurl.github.io/dsshop/">https://dspurl.github.io/dsshop/</a></p>
<p><a href="https://dswjcms_purl.gitee.io/dsshop/">https://dswjcms_purl.gitee.io/dsshop/</a></p>

官方插件
------------
> 插件可定制开发，也可自行开发，项目内置插件开发功能
<p>优惠券(免费)</p>
<p>评价(免费)</p>
<p>栏目文章(免费)</p>
<p>分销功能(免费)</p>
<p>产品参数模板(付费)</p>
<p>扫码登录(付费)</p>
<p>积分(付费)</p>
<p>积分商城(付费)</p>
<p>积分抽奖【大转盘、九宫格、老虎机】(付费)</p>
<p>秒杀(付费)</p>
<p>拼团(付费)</p>

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
- **消息通知** 集成多种通知途径：站内信、小程序、微信公众号、邮件等
- **注册协议** 自带隐私协议、注册协议（需添加栏目文章模块）
- **关联微信公众号** 系统已集成引导用户关注公众号代码，用户可轻松绑定微信公众号
- **邮件系统** 邮箱认证、绑定、消息通知发送
- **备份系统** 可对项目和数据库进行备份，并支持保留指定天数，超出后自动清除旧备份

效果图
------------
<p align="center">
  <img src="https://dspurl.github.io/image/a01.png" width="100%">
  <img src="https://dspurl.github.io/image/a02.png" width="100%">
  <img src="https://dspurl.github.io/image/a03.png" width="100%">
  <img src="https://dspurl.github.io/image/a04.png" width="100%">
  <img src="https://dspurl.github.io/image/a05.png" width="100%">
  <img src="https://dspurl.github.io/image/a06.png" width="100%">
  <img src="https://dspurl.github.io/image/a07.png" width="100%">
  <img src="https://dspurl.github.io/image/a08.png" width="100%">
  <img src="https://dspurl.github.io/image/a09.png" width="100%">
</p>

图标
------------
> 图标部分是svg，部分使用iconfont，iconfont并未明确可以免费用于商业用途，版权归图标作者所有，如对版权有要求的，请自行更换图标
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

版权说明
------------
- 通过官网注册并创建的应用(注册和创建应用不需要费用)可免费用于商业运营

联系我们
------------
- 开源项目可能存在BUG，如发现问题，可通过Github的issue进行提交，请根据提问格式提问，不符合的一律不回答。
- dsshop交流群，微信扫码进群
<p align="center">
  <img src="https://dspurl.github.io/image/12.png" width="200">
</p>