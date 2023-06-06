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
const filter = {
  '1000': function(val) {//字符串转货币, 保留二位小数
    return (parseFloat(val)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  },
  'smallImage': function(img,size) {//显示小图片
    var index=img.lastIndexOf('.');
	if(!size) 
		size=300;
    return img.substring(0,index) + '_'+ size +'.' + img.substring(index+1,img.length);
  }  
}

export default filter
