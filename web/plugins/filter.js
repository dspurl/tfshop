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
