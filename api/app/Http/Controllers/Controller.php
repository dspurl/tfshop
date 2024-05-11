<?php
/** +----------------------------------------------------------------------
 * | 公共方法
 * +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
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
/**
 * @group [PUBLIC]Controller(公共方法)
 * Class Controller
 * @package App\Http\Controllers
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Upload
     * 上传
     * @param Request $request
     * @bodyParam   file file 上传的文件
     * @queryParam  type int 1图片2自定义文件
     * @queryParam  size int 前端文件大小
     * @queryParam  full boolean    是否显示详细结果
     * @return mixed|string
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function uploadPictures(Request $request)
    {

        $file = $request->file('file');
        // 判断图片有效性
        if (!$file->isValid()) {
            return resReturn(0, __('upload_pictures.is_valid.error'), Code::CODE_PARAMETER_WRONG);
        }
        $extension = $request->file->extension();
        if (!isset($request->type)) {
            return resReturn(0, __('upload_pictures.type.error'), Code::CODE_PARAMETER_WRONG);
        }
        //验证尺寸
        if (!isset($request->size)) {
            return resReturn(0, __('upload_pictures.size.error'), Code::CODE_PARAMETER_WRONG);
        }
        if ($request->size < $request->file->getSize()) {
            return resReturn(0, __('upload_pictures.get_size.error'), Code::CODE_PARAMETER_WRONG);
        }
        if ($request->type == 1) { //验证图片
            $name = 'image';
        } else if ($request->type == 2) {  // 自定义文件
            $name = 'custom';
        } else {
            return resReturn(0, __('upload_pictures.type_inexistence.error'), Code::CODE_PARAMETER_WRONG);
        }
        if (!in_array($extension, explode(',', config("tfshop.file.$name.extension")))) {
            return resReturn(0, __('upload_pictures.extension.error'), Code::CODE_PARAMETER_WRONG);
        }
        if ($request->file->getSize() > config("tfshop.file.$name.size")) {
            return resReturn(0, __('upload_pictures.admin_size.error') . (config("tfshop.file.$name.size") / 1024 / 1024) . 'M', Code::CODE_PARAMETER_WRONG);
        }
        $url = $this->uploadFiles($file, $request);
        if ($url['state'] != 'SUCCESS') {
            return resReturn(0, $url['msg'], Code::CODE_PARAMETER_WRONG);
        }
        //微信小程序图片安全内容检测
        $config = config('wechat.mini_program.default');
        if ($request->header('apply-secret') && $config['app_id'] && $request->type == 1) {
            $miniProgram = Factory::miniProgram($config); // 小程序
            $result = $miniProgram->content_security->checkImage('storage/temporary/' . $url['title']);
            if ($result['errcode'] == 87014) {
                return resReturn(0, __('upload_pictures.mini_program.error'), Code::CODE_PARAMETER_WRONG);
            }
        }
        // 显示文件详细数据
        if ($request->has('full')) {
            return $url;
        } else {
            return $url['url'];
        }
    }

    /**
     * Upload processing
     * 上传处理
     * @param $file
     * @param $request
     * @return array|string[]
     */
    protected function uploadFiles($file, $request)
    {
        //生成文件名
        $extension = $file->getClientOriginalExtension();
        if ($extension == "") {//前端批量上传组件在拖动改变图片排序后, 扩展名会为空, 这里修补一下
            $extension = $request->file->extension();
            if ($extension == 'jpeg') $extension = 'jpg';
        }
        $randFileName = str_random(5) . time();
        $fileName = $randFileName . '.' . $extension;

        $pathName = 'temporary/' . $fileName;
        // 获取文件在临时文件中的地址
        $files = file_get_contents($file->getRealPath());
        $disk = Storage::disk('public');
        $disk->put($pathName, $files);
        // 根据前端传递值动态生成多规格图片
        if ($request->type == 1 && $request->has('specification')) {
//            if($extension != 'png'){
//                throw new \Exception(__('upload_pictures.specification_png.error'), Code::CODE_WRONG);
//            }
            $specificationArr = explode(',', $request->specification);
            if (count($specificationArr) < 1) {
                return array(
                    "state" => 'no',
                    'msg' => __('upload_pictures.specification.error')
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

    /**
     * 获取顶级域名
     * @param $url // 域名
     * @return string
     */
    public function getTopHost($url)
    {
        $url = strtolower($url);
        $hosts = parse_url($url);
        $host = $hosts['host'];
        //查看是几级域名
        $data = explode('.', $host);
        $n = count($data);
        //判断是否是双后缀
        $preg = '/[\w].+\.(com|net|org|gov|edu)\.cn$/';
        if (($n > 2) && preg_match($preg, $host)) {
            //双后缀取后3位
            $host = $data[$n - 3] . '.' . $data[$n - 2] . '.' . $data[$n - 1];
        } else {
            //非双后缀取后两位
            $host = $data[$n - 2] . '.' . $data[$n - 1];
        }
        return $host;
    }

    /**
     * 获取协议
     * @return string
     */
    public function scheme(){
        if (isset($_SERVER['HTTP_X_CLIENT_SCHEME'])) {
            $scheme = $_SERVER['HTTP_X_CLIENT_SCHEME'] . '://';
        } elseif (isset($_SERVER['REQUEST_SCHEME'])) {
            $scheme = $_SERVER['REQUEST_SCHEME'] . '://';
        } else {
            $scheme = 'http://';
        }
        return $scheme;
    }
}
