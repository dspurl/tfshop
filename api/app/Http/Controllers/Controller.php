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
use App\Http\Requests\v1\SubmitResourceUploadRequest;
use App\Models\v1\Resource;
use App\Models\v1\ResourceType;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;

/**
 * @group [PUBLIC]Controller(公共方法)
 * Class Controller
 * @package App\Http\Controllers
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * 资源上传
     * Resource upload
     * @param SubmitResourceUploadRequest $request
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function resourceUpload(SubmitResourceUploadRequest $request)
    {
        $file = $request->file('file');
        if (!$file->isValid()) {
            return resReturn(0, '上传文件无效', Code::CODE_PARAMETER_WRONG);
        }
        $ResourceType = ResourceType::where('uuid', $request->uuid)->first();
        if (!$ResourceType) {
            return resReturn(0, '资源分类有误', Code::CODE_PARAMETER_WRONG);
        }
        $info = [
            'extension' => $file->extension(),
            'size' => $file->getSize(),
            'type' => $file->getClientMimeType(),
            'originalName' => $file->getClientOriginalName()
        ];
        if (count($ResourceType->extension) != 0 && !in_array($info['extension'], $ResourceType->extension)) {
            return resReturn(0, '文件格式有误' . $info['extension'], Code::CODE_PARAMETER_WRONG);
        }
        if ($ResourceType->size != 0 && $info['size'] > $ResourceType->size) {
            return resReturn(0, '资源大小超出配置大小' . $ResourceType->size . 'B', Code::CODE_PARAMETER_WRONG);
        }
        $randFileName = random_int(10000, 99999) . time();
        if ($ResourceType->alias === 'resource') {    //如果别名是资源的话，不上传到临时目录中
            $pathName = 'resource/';
        } else {
            $pathName = 'temporary/';
        }
        // 文件保存到指定目录
        $resourceInfo = $this->localResourceHandling($file, $pathName, $randFileName, $ResourceType);
        //微信小程序图片安全内容检测
        $config = config('wechat.mini_program.default');
        // 如果是前端用户，且上传为图片才触发
        if ($request->header('apply-secret') && $config['app_id'] && $ResourceType->alias === 'image') {
            $miniProgram = Factory::miniProgram($config); // 小程序
            $result = $miniProgram->content_security->checkImage("storage/$pathName" . $resourceInfo['fileName']);
            if ($result['errcode'] == 87014) {
                return resReturn(0, '图片含有敏感信息，请重新上传', Code::CODE_PARAMETER_WRONG);
            }
        }
        // 如果是资源库上传，直接写入资源表中
        /*if ($ResourceType->alias === 'resource') {
            $Resource = (new Resource())->create([
                'resource_type_id' => $ResourceType->id,
                'resource_group_id' => 0,
                'name' => $resourceInfo['fileName'],
                'url' => $resourceInfo['url'],
                'info' => $info,
            ]);
            $Resource['id'] = $Resource->id;
        }*/
        $Resource = (new Resource())->create([
            'resource_type_id' => $ResourceType->id,
            'resource_group_id' => 0,
            'name' => $resourceInfo['fileName'],
            'url' => $resourceInfo['url'],
            'info' => $info,
        ]);
        $Resource['id'] = $Resource->id;
        return resReturn(1, [
            "id" => $Resource['id'],
            "state" => "SUCCESS",                               //上传状态，上传成功时必须返回"SUCCESS"
            "url" => $resourceInfo['url'],                      //返回的地址
            "name" => $resourceInfo['fileName'],                //新文件名
            "original" => $info['originalName'],                //原始文件名
            "type" => $info['type'],                            //文件类型
            "size" => $info['size']                             //文件大小
        ]);
    }


    /**
     * 本地资源处理
     * Resource upload
     * @param $file
     * @param $pathName
     * @param $randFileName
     * @param $ResourceType
     * @return mixed
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    protected function localResourceHandling($file, $pathName, $randFileName, $ResourceType)
    {
        $info = [
            'extension' => $file->extension(),
            'size' => $file->getSize(),
            'type' => $file->getClientMimeType(),
            'originalName' => $file->getClientOriginalName(),
        ];
        $data['fileName'] = $randFileName . '.' . $info['extension'];
        $files = file_get_contents($file->getRealPath());
        $disk = Storage::disk('public');
        $disk->put($pathName . $data['fileName'], $files);
        $data['url'] = request()->root() . '/storage/' . $pathName . $data['fileName'];
        $data['id'] = '';
        // 多规格图片处理，只有配置了资源格式规格(图片)的才处理
        if (count($ResourceType->specification) > 0 && in_array($ResourceType->extension, array('gif', 'jpg', 'jpeg', 'bmp', 'png'))) {
            $specification = $ResourceType->specification;
            rsort($specification);
            $realBasePath = public_path() . '/storage/';
            $imgSmall = \Image::make($disk->get($pathName . $data['fileName']));
            foreach ($specification as $s) {
                $imgSmall->widen($s);
                $imgSmall->save($realBasePath . $pathName . $randFileName . "_$s." . $info['extension']);
            }
        }
        return $data;
    }

    /**
     * 自定义条件筛选，支持关联表查询
     * Custom filter criteria, support associated table query
     * @param $q
     * @param $filter
     * @return mixed
     * @throws \Exception
     */
    protected function customFilterCriteria($q, $filter)
    {
        if (!is_array($filter)) {
            throw new \Exception('请求的filter格式有误', Code::CODE_WRONG);
        }
        foreach ($filter as $id => $f) {
            $value = explode('|', $f);
            if (count($value) === 1) {
                throw new \Exception('缺少分割符|', Code::CODE_WRONG);
            }

            $more = explode(',', $value[0]);
            // 关联查询
            if (strpos($id, '.') !== false) {
                $join = explode('.', $id);
                $condition = $join[count($join) - 1];   //获取字段名

                unset($join[count($join) - 1]); //删除字段名
                $nest = implode('.', $join);    //获取嵌套的关联表名
                $q->whereHas($nest, function ($query) use ($condition, $value, $more) {
                    switch ($value[1]) {
                        case '=':
                            // 日期区间处理
                            if (count($more) > 1) {
                                $query->where($condition, '>=', $more[0])->where($condition, '<=', $more[1]);
                            } else {
                                $query->where($condition, $value[0]);
                            }
                            break;
                        case '!=':
                        case '>':
                        case '>=':
                        case '<':
                        case '<=':
                            $query->where($condition, $value[1], $value[0]);
                            break;
                        case 'include':
                            // 多个值
                            if (count($more) > 1) {
                                $query->whereIn($condition, $more);
                            } else {
                                $query->where($condition, 'like', "%$value[0]%");
                            }
                            break;
                        case 'notinclude':
                            // 多个值
                            if (count($more) > 1) {
                                $query->whereNotIn($condition, $more);
                            } else {
                                $query->where($condition, 'not like', "%$value[0]%");
                            }
                            break;
                    }
                });
            } else {
                switch ($value[1]) {
                    case '=':
                        // 日期区间处理
                        if (count($more) > 1) {
                            $q->where($id, '>=', $more[0])->where($id, '<=', $more[1]);
                        } else {
                            $q->where($id, $value[0]);
                        }
                        break;
                    case '!=':
                    case '>':
                    case '>=':
                    case '<':
                    case '<=':
                        $q->where($id, $value[1], $value[0]);
                        break;
                    case 'include':
                        // 多个值
                        if (count($more) > 1) {
                            $q->whereIn($id, $more);
                        } else {
                            $q->where($id, 'like', "%$value[0]%");
                        }
                        break;
                    case 'notinclude':
                        // 多个值
                        if (count($more) > 1) {
                            $q->whereNotIn($id, $more);
                        } else {
                            $q->where($id, 'not like', "%$value[0]%");
                        }
                        break;
                }
            }
        }
        return $q;
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
    public function scheme()
    {
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
