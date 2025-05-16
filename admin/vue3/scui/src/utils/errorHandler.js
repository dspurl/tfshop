/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
/**
 * 全局代码错误捕捉
 * 比如 null.length 就会被捕捉到
 */

export default (error, vm)=>{
	//过滤HTTP请求错误
	if(error.status || error.status==0){
		return false
	}

	var errorMap = {
		InternalError: "Javascript引擎内部错误",
		ReferenceError: "未找到对象",
		TypeError: "使用了错误的类型或对象",
		RangeError: "使用内置对象时，参数超范围",
		SyntaxError: "语法错误",
		EvalError: "错误的使用了Eval",
		URIError: "URI错误"
	}
	var errorName = errorMap[error.name] || "未知错误"

	console.warn(`[SCUI error]: ${error}`);
	console.error(error);
	//throw error;

	vm.$nextTick(() => {
		vm.$notify.error({
			title: errorName,
			message: error
		});
	})
}
