<?php

namespace App\Http\Controllers;

use App\Code;
use function EasyWeChat\Kernel\Support\str_random;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use EasyWeChat\Factory;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    //小程序上传
    // type 类型1图片
    // size 文件大小
    public function uploadPictures(Request $request)
    {

        $file = $request->file('file');
        // 判断图片有效性
        if (!$file->isValid()) {
            return resReturn(0, '上传文件无效', Code::CODE_PARAMETER_WRONG);
        }
        $extension = $request->file->extension();
        //验证格式
        if (!isset($request->type) || ($request->type != 1 && $request->type != 2)) { //验证图片
            return resReturn(0, '图片参数有误', Code::CODE_PARAMETER_WRONG);
        } else {
            if (!in_array($extension, array('gif', 'jpg', 'jpeg', 'bmp', 'png'))) {
                return resReturn(0, '图片格式有误', Code::CODE_PARAMETER_WRONG);
            }
        }

        //验证尺寸
        if (!isset($request->size)) {
            return resReturn(0, '尺寸参数有误', Code::CODE_PARAMETER_WRONG);
        } else {
            if ($request->size < $request->file->getSize()) {
                return resReturn(0, '您上传的文件过大', Code::CODE_PARAMETER_WRONG);
            }
        }
        $url = $this->uploadFiles($file, $request);
        if ($url['state'] != 'SUCCESS') {
            return resReturn(0, $url['msg'], Code::CODE_PARAMETER_WRONG);
        }

        //微信小程序图片安全内容检测
        $config = config('wechat.mini_program.default');
        if ($request->header('apply-secret') && $config['app_id']) {
            $miniProgram = Factory::miniProgram($config); // 小程序
            $result = $miniProgram->content_security->checkImage('storage/temporary/' . $url['title']);
            if ($result['errcode'] == 87014) {
                return resReturn(0, '图片含有敏感信息，请重新上传', Code::CODE_PARAMETER_WRONG);
            }
        }
        return $url['url'];
    }

    //上传文件
    protected function uploadFiles($file, $request)
    {
        //多一层验证，防止直接调用此方法，对文件直接放行
        $extension = $request->file->extension();
        if (!isset($request->type) || ($request->type != 1 && $request->type != 2)) { //验证图片
            return array(
                "state" => 'no',
                'msg' => '图片参数有误'
            );
        } else {
            if (!in_array($extension, array('gif', 'jpg', 'jpeg', 'bmp', 'png'))) {
                return array(
                    "state" => 'no',
                    'msg' => '图片格式有误'
                );
            }
        }
        // 判断图片有效性
        if (!$file->isValid()) {
            return array(
                "state" => 'no',
                'msg' => '上传文件无效'
            );
        }
        //生成文件名
        $extension = $file->getClientOriginalExtension();
        if ($extension == "") {//前端批量上传组件在拖动改变图片排序后, 扩展名会为空, 这里修补一下
            $extension = $request->file->extension();
            if ($extension == 'jpeg') $extension = 'jpg';
        }
        $randFileName = str_random(5) . time();
        $fileName = $randFileName . '.' . $extension;

        $pathName = 'temporary/' . $fileName;
        // 获取图片在临时文件中的地址
        $files = file_get_contents($file->getRealPath());
        $disk = Storage::disk('public');
        $disk->put($pathName, $files);
        // 根据前端传递值动态生成多规格图片
        if ($request->has('specification')) {
            $specificationArr = explode(',', $request->specification);
            if (count($specificationArr) < 1) {
                return array(
                    "state" => 'no',
                    'msg' => 'specification格式有误'
                );
            }
            $realBasePath = public_path() . '/storage/';
            $imgSmall = \Image::make($realBasePath . $pathName);
            $imageSpecification = config('image.specification');
            rsort($specificationArr);   //将前端输入的规格按大到小排序，不然将导致先生成小图片后再生成大图模糊的问题
            foreach ($specificationArr as $specification) {
                if (in_array($specification, $imageSpecification)) {
                    $imgSmall->widen($specification);
                    $imgSmall->save($realBasePath . 'temporary/' . $randFileName . "_$specification." . $extension);
                }
            }
        }
        $url = request()->root() . '/storage/' . $pathName;
        return array(
            "state" => "SUCCESS",        //上传状态，上传成功时必须返回"SUCCESS"
            "url" => $url,            //返回的地址
            "title" => $fileName,       //新文件名
            "original" => $file->getClientOriginalName(),       //原始文件名
            "type" => $file->getClientMimeType(),            //文件类型
            "size" => $file->getSize()           //文件大小
        );
    }
}
