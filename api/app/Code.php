<?php

namespace App;


//自定义状态码
class Code
{
    const CODE_SYSTEM_BUSY = -1; //系统繁忙，请稍后再试
    const CODE_INEXISTENCE = 50000; //不存在
    const CODE_WRONG = 50001;  //不正确
    const CODE_NO_ACCESS = 50002;  //无权限
    const CODE_MISUSE = 50003;  //非法操作
    const CODE_PARAMETER_WRONG = 50004;  //参数有误
    const CODE_FORBIDDEN = 50005;  //禁止访问
    const CODE_PERMISSION_CONFIGURATION = 50006;  //权限配置有误
}
