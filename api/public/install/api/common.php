<?php
/**
 * 数据返回封装
 * @param $data
 * @return string
 */
function resReturn($data)
{
    header('Content-Type:application/json');
    header("Access-Control-Allow-Origin: *");
    echo json_encode($data);
    exit;
}

function getPermission($folder)
{
    if(!fileperms($folder)){
        resReturn([
            'code'=>1,
            'msg'=>'目录结构有误'
        ]);
    }
    $jurisdiction = substr(sprintf('%o', fileperms($folder)), -3);
    if($jurisdiction == '777' || $jurisdiction == '755'){
        return [
            'jurisdiction'=>$jurisdiction,
            'state'=>true,
        ];
    }else {
        return [
            'jurisdiction'=>$jurisdiction,
            'state'=>false,
        ];
    }
}

/**
 * sell执行代码生成
 * @param $code
 * @return string|null
 */
function sellCode($code){
    return shell_exec("cd ../../../ & $code");
}
