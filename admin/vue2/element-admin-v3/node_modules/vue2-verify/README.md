# vue2-verify

> 基于[https://github.com/Hibear/verify](https://github.com/Hibear/verify) 的验证码项目  
> 项目验证码类型[请查看](http://veui.net/)

## 支持的验证码类型  

1. **常规验证码picture** 常规的验证码由数字和字母构成，用户输入不区分大小写，可变形成汉字验证。 
2. **运算验证码compute** 运算验证码主要通过给出数字的加减乘运算，填写运算结果进行验证。 
3. **滑动验证码slide** 通过简单的滑动即可完成验证，应用与移动端体验很好。  
4. **拼图验证码puzzle** 拼图。 
5. **选字验证码pick** 通过按顺序点选图中的汉字完成验证，ie浏览器要求9或以上。  

## 请记住一件事！
> 纯前端是可以被别人绕过验证的!

## todo
1. 添加在线演示和修改

## 文档
### 如何使用
```npm i vue2-verify```

### 事件
<table >
<tr>
<th>参数</th>
<th>说明</th>
</tr>
<tr>
<td><code>ready</code></td>
<td>验证码初始化成功的回调函数。</td>
</tr>
<tr>
<td><code>success</code></td>
<td>验证码匹配成功后的回调函数。如要重新初始化：success:function(obj){obj.refresh();}。</td>
</tr>
<tr>
<td><code>error</code></td>
<td>验证码匹配失败后的回调函数。</td>
</tr>
</table>

### 常规验证码picture
#### 参数说明
<table >
<tr>
<th>参数</th>
<th>说明</th>
</tr>
<tr>
<td><code>type</code></td>
<td>验证码type为picture或者1</td>
</tr>
<tr>
<td><code>width</code></td>
<td>常规验证码的宽,支持百分比形式设置，如：width:100%。</td>
</tr>
<tr>
<td><code>height</code></td>
<td>常规验证码的高,支持百分比形式设置，如：height:10%。</td>
</tr>
<tr>
<td><code>fontSize</code></td>
<td>常规验证码中的字母&amp;数字的字体大小，默认为30px。</td>
</tr>
<tr>
<td><code>codeLength</code></td>
<td>常规验证码中显示的验证码个数，默认为6。</td>
</tr>
</table>


### 运算验证码
#### 参数说明
<table >
<tr>
<th>参数</th>
<th>说明</th>
</tr>
<tr>
<td><code>type</code></td>
<td>验证码type为compute或者2</td>
</tr>
<tr>
<td><code>figure</code></td>
<td>运算验证码的位数,默认是100以内的数字，即两位数。如果是要设置三位数，则设置figure:1000。</td>
</tr>
<tr>
<td><code>arith</code></td>
<td>算法选择，支持加、减、乘。设置为1至3分别代表加减乘，0为随机切换。。</td>
</tr>
<tr>
<td><code>width</code></td>
<td>运算验证码的宽,支持百分比形式设置，如：width:100%。</td>
</tr>
<tr>
<td><code>height</code></td>
<td>运算验证码的高,支持百分比形式设置，如：height:10%。</td>
</tr>
<td><code>fontSize</code></td>
<td>运算验证码中的数字的字体大小，默认为30px。</td>
</tr>
<tr>
<td><code>showButton</code></td>
<td>是否显示确定按钮，默认为true</td>
</tr>
</table>


### 滑动验证码
#### 参数说明
<table >
<tr>
<th>参数</th>
<th>说明</th>
</tr>
<tr>
<td><code>type</code></td>
<td>验证码type为slide或者3</td>
</tr>
<tr>
<td><code>vOffset</code></td>
<td>滑动验证码的误差量，如：误差量为5px就能完成验证，设置vOffset:5。</td>
</tr>
<tr>
<td><code>explain</code></td>
<td>滑动条内的提示，不设置默认是：向右滑动完成验证。</td>
</tr>
<tr>
<td><code>barSize</code></td>
<td>其中包含了width、height两个参数，分别代表滑动条的宽度和高度，支持百分比方式设置，如：{width:'100%',height:'40px'}</td>
</tr>
<tr>
<td><code>showButton</code></td>
<td>是否显示确定按钮，默认为true</td>
</tr>
</table>

### 拼图验证码
#### 参数说明
<table >
<tr>
<th>参数</th>
<th>说明</th>
</tr>
<tr>
<td><code>type</code></td>
<td>验证码type为puzzle或者4</td>
</tr>
<tr>
<td><code>mode</code></td>
<td>验证码的显示方式，弹出式pop，固定fixed，默认是：mode : 'fixed'。</td>
</tr>
<tr>
<td><code>vOffset</code></td>
<td>滑动验证码的误差量，默认单位是px。如：误差量为5px就能完成验证，设置vOffset:5。</td>
</tr>
<tr>
<td><code>vSpace</code></td>
<td>验证码图片和移动条容器的间隔，默认单位是px。如：间隔为5px，设置vSpace:5。</td>
</tr>
<tr>
<td><code>explain</code></td>
<td>滑动条内的提示，不设置默认是：'向右滑动完成验证'。</td>
</tr>
<tr>
<td><code>imgUrl</code></td>
<td>背景图片的地址，不设置默认是：'images/'。</td>
</tr>
<tr>
<td><code>imgName</code></td>
<td>验证码背景图的数组集合，默认从images目录中进行读取，如 ['1.jpg', '2.jpg']。</td>
</tr>
<tr>
<td><code>imgSize</code></td>
<td>其中包含了width、height两个参数，分别代表图片的宽度和高度，支持百分比方式设置 如:{width:'100%',height:'200px'}。</td>
</tr>
<tr>
<td><code>blockSize</code></td>
<td>其中包含了width、height两个参数，分别代表拼图块的宽度和高度，如:{width:'40px',height:'40px'}。。</td>
</tr>
<tr>
<td><code>barSize</code></td>
<td>其中包含了width、height两个参数，分别代表滑动条的宽度和高度，支持百分比方式设置，如:{width:'100%',height:'40px'}</td>
</tr>
<tr>
<td><code>showButton</code></td>
<td>是否显示确定按钮，默认为true</td>
</tr>
</table>

### 选字验证码
#### 参数说明
<table >
<tr>
<th>参数</th>
<th>说明</th>
</tr>
<tr>
<td><code>type</code></td>
<td>验证码type为pick或者5</td>
</tr>
<tr>
<td><code>mode</code></td>
<td>验证码的显示方式，弹出式pop，固定fixed，默认是：mode : 'fixed'。</td>
</tr>
<tr>
<td><code>defaultNum</code></td>
<td>验证码中出现的文字数量，如要默认4个字</td>
</tr>
<tr>
<td><code>checkNum</code></td>
<td>验证码中要求比对的文字数量，如要按序比对2个字</td>
</tr>
<tr>
<td><code>vSpace</code></td>
<td>验证码图片和移动条容器的间隔，默认单位是px。</td>
</tr>
<tr>
<td><code>imgUrl</code></td>
<td>背景图片的地址，不设置默认是：'images/'。</td>
</tr>
<tr>
<td><code>imgName</code></td>
<td>验证码背景图的数组集合，默认从images目录中进行读取，如 ['1.jpg', '2.jpg']。</td>
</tr>
<tr>
<td><code>imgSize</code></td>
<td>其中包含了width、height两个参数，分别代表图片的宽度和高度，支持百分比方式设置 如:{width:'100%',height:'200px'}。</td>
</tr>
<tr>
<td><code>barSize</code></td>
<td>其中包含了width、height两个参数，分别代表滑动条的宽度和高度，支持百分比方式设置，如:{width:'100%',height:'40px'}</td>
</tr>
<tr>
<td><code>showButton</code></td>
<td>是否显示确定按钮，默认为true</td>
</tr>
</table>


```
// 基础用例

<template>
      <Verify @success="alert('success')" @error="alert('error')" :type="1"></Verify>
</template>


<script>
    import Verify from 'vue2-verify'

    export default {
        name: 'app',
        methods: {
            alert(text) {
                console.log(text)
            }
        },
        components: {
            Verify
        }
    }
</script>
```