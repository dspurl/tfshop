/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import Vue from 'vue'
// 千分位
export function thousands(val) {
  return (parseFloat(val)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}
// 显示小图片
export function smallImage (img,size) {
  var index=img.lastIndexOf('.');
  if(!size)
    size=300;
  return img.substring(0,index) + '_'+ size +'.' + img.substring(index+1,img.length);
}
let filters = {
  thousands,
  smallImage
};

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
export default filters
