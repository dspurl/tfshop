
####工具
**request网络请求**

https://ext.dcloud.net.cn/plugin?id=468

**canvas生成海报**
https://github.com/xlfsummer/mp-painter




### canvasData
|  属性 | 类型   | 是否必须  |  说明 |
| ------------ |------------ | ------------ | ------------ |
| block  |  number | 否 | 水平分割，如2、4、6 设置后  |
|  align |  string | 否 |  对方方式 左对齐：left;居中对齐:center;右对齐: right |
|   x |  number | 否 |  绘制文本的左上角 x 坐标位置，当设置align后，x为偏移量 |
|   y |  number | 否 |  绘制文本的左上角 y 坐标位置 |
|  width |  number | 否 |  宽度 默认为元素自身宽度 |
|  height |  number | 否 |  宽度 默认为20 |
|  line |  number | 否 |  显示行数 默认为1 |
|  share |  number | 否 |  份额，共12份 |
|  strokeStyle |  number | 否 |  描边颜色 |
|  type |  string | 否 |  类型 图片:image; 文本:text; 带边框的文本:box;table:表格(设为table后，以下属性除son外都失效) |
|  padding |  number | 否 |  内边距 |
|  fillStyle |  number | 否 |  设置填充色，仅针对text |
|  fontSize |  number | 否 |  字体大小，仅针对text |
|  textAlign |  string | 否 |  文字的对齐 左对齐：left;居中对齐:center;右对齐: right |
|  bold |  boolean | 否 |  是否加粗，默认为 false |
|  textBaseline |  string | 否 |  设置文字的竖直对齐 顶部:top;底部:bottom;居中:middle;无:normal ，仅针对text|
|  text |  string | 否 |  内容 |
|  son |  object | 否 |  子项，设有排列方式时，son为必须 |


### block.son
|  属性 | 类型   | 是否必须  |  说明 |
| ------------ |------------ | ------------ | ------------ |
|  width |  number | 否 |  宽度 默认为元素自身宽度 |
|  height |  number | 否 |  宽度 默认为20 |
|  line |  number | 否 |  显示行数 默认为1 |
|  align |  string | 否 |  对方方式 左对齐：left;居中对齐:center;右对齐: right |
|  type |  string | 是 |  类型 th:表头 td:表格 |
|  fillStyle |  number | 否 |  设置填充色，仅针对text |
|  fontSize |  number | 否 |  字体大小，仅针对text |
|  bold |  boolean | 否 |  是否加粗，默认为 false |
|  padding |  number | 否 |  内边距 |
|  textAlign |  string | 否 |  文字的对齐 左对齐：left;居中对齐:center;右对齐: right |
|  text |  string | 是 |  内容 |

### canvasData.son
|  属性 | 类型   | 是否必须  |  说明 |
| ------------ |------------ | ------------ | ------------ |
|  align |  string | 否 |  对方方式 左对齐：left;居中对齐:center;右对齐: right |
|   x |  number | 否 |  绘制文本的左上角 x 坐标位置，当设置align后，x为偏移量 |
|   y |  number | 否 |  绘制文本的左上角 y 坐标位置 |
|  width |  number | 否 |  宽度 默认为元素自身宽度 |
|  height |  number | 否 |  宽度 默认为20 |
|  line |  number | 否 |  显示行数 默认为1 |
|  align |  string | 否 |  对方方式 左对齐：left;居中对齐:center;右对齐: right |
|  type |  string | 是 |  类型 图片:image; 文本:text; 带边框的文本:box; table:表格 |
|  fillStyle |  number | 否 |  设置填充色，仅针对text |
|  fontSize |  number | 否 |  字体大小，仅针对text |
|  textAlign |  string | 否 |  文字的对齐 左对齐：left;居中对齐:center;右对齐: right |
|  bold |  boolean | 否 |  是否加粗，默认为 false |
|  padding |  number | 否 |  内边距 |
|  textBaseline |  string | 否 |  设置文字的竖直对齐 顶部:top;底部:bottom;居中:middle;无:normal ，仅针对text|
|  text |  string | 是 |  内容 |
|  son |  object | 否 |  子项，type为table时，son为必须 |


### canvasData.son.table.son
|  属性 | 类型   | 是否必须  |  说明 |
| ------------ |------------ | ------------ | ------------ |
|  width |  number | 否 |  宽度 默认为元素自身宽度 |
|  height |  number | 否 |  宽度 默认为20 |
|  line |  number | 否 |  显示行数 默认为1 |
|  align |  string | 否 |  对方方式 左对齐：left;居中对齐:center;右对齐: right |
|  type |  string | 是 |  类型 th:表头 td:表格 |
|  fillStyle |  number | 否 |  设置填充色，仅针对text |
|  fontSize |  number | 否 |  字体大小，仅针对text |
|  bold |  boolean | 否 |  是否加粗，默认为 false |
|  textAlign |  string | 否 |  文字的对齐 左对齐：left;居中对齐:center;右对齐: right |
|  text |  string | 是 |  内容 |
|  padding |  number | 否 |  内边距 |

##### 子类都是基于父类累加的，比如x、y
##### 子类如果有配置，子类优先级将大于父类，如padding