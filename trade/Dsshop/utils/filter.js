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
