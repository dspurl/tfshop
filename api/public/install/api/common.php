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
    if(isset($data['msg'])){
        $data['msg'] = mb_convert_encoding($data['msg'], 'UTF-8', 'UTF-8');
    }
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
    if($jurisdiction == '777'){
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
    return shell_exec("cd ../../../ && $code");
}

/**
 * 替换域名
 * @param $path
 * @param $envArr
 */
function alternateDomainName($path, $envArr)
{
    $filename = scandir('../../'.$path);
    foreach ($filename as $f) {
        if ($f == "." || $f == "..") {
            continue;
        }
        $file = file_get_contents('../../'.$path.'/'.$f);
        $file = str_replace("http://dsshop.test", $envArr['APP_URL'], $file);
        $file = str_replace("DSSHOP电商商城", $envArr['APP_NAME'], $file);
        file_put_contents('../../'.$path.'/'.$f, $file);
    }
}
