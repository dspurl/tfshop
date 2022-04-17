<?php

return [
    'parities'=>env('INTEGRAL_MALL_PARITIES', 0.01),         // 积分汇率不得低于0.01，不然将引响积分计算精度
];
