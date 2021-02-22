<?php

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

/**
 * response封装
 * @param int $state 状态    0错误1正确
 * @param array|string $message 返回数据
 * @param string $code 自定义状态码
 * @param string $httpcode HTTP状态码
 * @return string
 */
function resReturn($state = 1, $message = '', $code = '', $httpcode = '')
{
    if ($state == 0) {
        return response()->json(array(
            'code' => $code ? $code : \App\Code::CODE_SYSTEM_BUSY,
            'message' => $message,
            'result' => 'error',
        ), $httpcode ? $httpcode : Response::HTTP_UNAUTHORIZED);
    } else {
        return response()->json(array(
            'result' => 'ok',
            'message' => $message,
        ), Response::HTTP_OK);
    }
}

/**
 * 获取无限分级
 * @param array $items 数据源
 * @param string $pid 父类键值
 * @param string $son 子类键名
 * @return array
 */
function genTree($items, $pid = "pid", $son = "children")
{
    $map = [];
    $tree = [];
    foreach ($items as &$it) {
        $map[$it['id']] = &$it;
    }
    foreach ($items as &$it) {
        $parent = &$map[$it[$pid]];
        if ($parent) {
            $parent[$son][] = &$it;
        } else {
            $tree[] = &$it;
        }
    }
    return $tree;
}

/**
 * 删除多维数组里面的指定的键值对
 * @param array $unset 需要删除的键值对
 * @param array $array 原数组
 * @return array
 */
function unsetMultiKeys($unset, $array)
{
    $arrayIterator = new \RecursiveArrayIterator($array);
    $recursiveIterator = new \RecursiveIteratorIterator($arrayIterator, \RecursiveIteratorIterator::SELF_FIRST);
    foreach ($recursiveIterator as $key => $value) {
        foreach ($unset as $v) {
            if (is_array($value) && array_key_exists($v, $value)) {
                // 删除不要的值
                unset($value[$v]);
                // Get the current depth and traverse back up the tree, saving the modifications
                $currentDepth = $recursiveIterator->getDepth();
                for ($subDepth = $currentDepth; $subDepth >= 0; $subDepth--) {
                    // Get the current level iterator
                    $subIterator = $recursiveIterator->getSubIterator($subDepth);
                    // If we are on the level we want to change, use the replacements ($value) other wise set the key to the parent iterators value
                    $subIterator->offsetSet($subIterator->key(), ($subDepth === $currentDepth ? $value : $recursiveIterator->getSubIterator(($subDepth + 1))->getArrayCopy()));
                }
            }
        }
    }
    return $recursiveIterator->getArrayCopy();
}

//获取所有父类值
function getParentClassHierarchy($pid, $options, &$return = array())
{
    foreach ($options as $o) {
        if ($o['id'] == $pid) {
            array_unshift($return, $o['id']);
            getParentClassHierarchy($o['pid'], $options, $return);
            continue;
        }
    }
    return $return;
}

/**
 * SKU码生成
 * @param $number
 * @param string $prefix
 * @param int $minimun
 * @return string
 */
function generateSerialnum($number, $prefix = '', $minimun = 171123)
{
    $number = $number + $minimun;

    if ($prefix) {
        $chr = rand(65, 90);
    } else {
        $first = substr($number, 0, 1) - 1;
        $chr = 65 + $first + (strlen($number) - strlen($minimun)) * 10;
        $chr = $chr >= 90 ? 90 : $chr;
    }

    return $prefix . chr($chr)
        . chr(rand(65, 90))
        . chr(rand(65, 90))
        . chr(rand(65, 90))
        . '_'
        . sprintf('%1$08d', $number);
}

function orderNumber()
{
    $order = preg_replace('/\./', '', microtime(true) . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT));
    if (strlen($order) == 18) {
        $order = $order . '0';
    }
    return $order;
}

/**
 * 图片保存路径转换
 * @param string $new 保存的目录
 * @param string $img 图片
 * @return string
 */
function imgPathShift($new, $img)
{
    if (config('dswjcms.homestead')) {
        $path = request()->root() . '/storage/temporary/';
        $img = explode($path, $img);
        if (count($img) == 2) {   //上传过的图片才进行处理
            if (!file_exists('storage/image/' . $new)) {    //不存在目录新建
                @mkdir("storage/image/$new", 0777, true);
            }
            if (file_exists('storage/temporary/' . $img['1'])) { // 存在图片时进行拷贝操作
                copy('storage/temporary/' . $img['1'], 'storage/image/' . $new . '/' . $img['1']);
                unlink('storage/temporary/' . $img['1']);
                //拷贝不同规格的图片
                $imageSpecification = config('image.specification');
                $iarr = explode('.', $img['1']);
                foreach ($imageSpecification as $specification) {
                    $img_specification = $iarr[0] . "_$specification." . $iarr['1'];
                    if (file_exists('storage/temporary/' . $img_specification)) { //判断文件是否存在
                        copy('storage/temporary/' . $img_specification, 'storage/image/' . $new . '/' . $img_specification);
                        unlink('storage/temporary/' . $img_specification);
                    }
                }
            }

            return request()->root() . '/storage/image/' . $new . '/' . $img['1'];
        } else {
            return $img['0'];
        }

    } else {
        $path = 'storage/temporary/';
        $img = explode($path, $img);
        if (count($img) == 2) {
            Storage::move('public/temporary/' . $img['1'], 'public/image/' . $new . '/' . $img['1']);
            //拷贝不同规格的图片
            $imageSpecification = config('image.specification');
            $iarr = explode('.', $img['1']);
            foreach ($imageSpecification as $specification) {
                $img_specification = $iarr[0] . "_$specification." . $iarr['1'];
                if (Storage::exists('public/temporary/' . $img_specification)) { //判断文件是否存在
                    Storage::move('public/temporary/' . $img_specification, 'public/image/' . $new . '/' . $img_specification);
                }
            }
            return request()->root() . '/storage/image/' . $new . '/' . $img['1'];
        } else {
            return $img['0'];
        }

    }
}

/**
 * 根据图片路径进行删除
 * @param $directory // 图片所在目录
 * @param $img // 图片url
 * @return string
 */
function imgPathDelete($directory, $img)
{
    $img = explode('/', $img);
    if (count($img) > 1) {
        //删除不同规格的图片
        $imageSpecification = config('image.specification');
        $iarr = explode('.', end($img));
        foreach ($imageSpecification as $specification) {
            $img_specification = $iarr[0] . "_$specification." . $iarr['1'];
            if (Storage::exists('public/image/' . $directory . '/' . $img_specification)) { //判断文件是否存在
                Storage::delete('public/image/' . $directory . '/' . $img_specification);
            }
        }
        Storage::delete('public/image/' . $directory . '/' . end($img));
    }
}

/**
 * 根据给出的路径自动删除
 * @param $resource // 资源url
 * @return string
 */
function resourceAutoDelete($resource)
{
    $path = request()->root() . '/storage/image/';
    $data = explode($path, $resource);
    if (count($data) > 1) {
        //$data[1]: XX/xx.jpg
        //本地将无法删除
        if (Storage::exists('public/image/' . $data[1])) {
            Storage::delete('public/image/' . $data[1]);
        }
    }
}

/**
 * 图片查找替换并更新
 * @param string $str
 * @param string $path
 * @return string
 */
function imgFindReplaceUpdate($str, $path)
{
    $reg = '/<img src=\"(.+?)\".*?>/';
    $matches = array();
    preg_match_all($reg, $str, $matches);
    if (count($matches[1]) > 0) {
        foreach ($matches[1] as $img) {
            $newImg = imgPathShift($path, $img);
            $str = str_replace($img, $newImg, $str);
        }
    }
    return $str;
}

/**
 * 将下划线命名转换为驼峰式命名
 * @param $str
 * @param bool $ucfirst
 * @return mixed|string
 */
function convertUnderline($str, $ucfirst = true)
{
    $str = ucwords(str_replace('_', ' ', $str));
    $str = str_replace(' ', '', lcfirst($str));
    return $str;
}

/**
 * 将前端的排序转为后台排序参数
 * @param $sortOriginal
 * @return mixed|string
 */
function sortFormatConversion($sortOriginal)
{
    $sort = explode("-", $sortOriginal);
    if (count($sort) == 2) { //倒序
        return [$sort[1], 'DESC'];
    } else {
        $sort = explode("+", $sortOriginal);
        if (count($sort) == 2) {
            return [$sort[1], 'ASC'];
        } else {
            return [$sortOriginal, 'ASC'];
        }
    }
}
