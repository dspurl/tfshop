<?php

namespace App\Http\Controllers;

use App\Code;
use App\Http\Requests\v1\SubmitResourceUploadRequest;
use App\Models\v1\Resource;
use App\Models\v1\ResourceType;

use http\Exception;
use function EasyWeChat\Kernel\Support\str_random;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use EasyWeChat\Factory;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * 资源上传
     * Resource upload
     * @param SubmitResourceUploadRequest $request
     * @return string
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
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
            return resReturn(0, '文件格式有误', Code::CODE_PARAMETER_WRONG);
        }
        if ($ResourceType->size != 0 && $info['size'] > $ResourceType->size) {
            return resReturn(0, '资源大小超出配置大小' . $ResourceType->size . 'B', Code::CODE_PARAMETER_WRONG);
        }
        $randFileName = str_random(5) . time();
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
        if ($ResourceType->alias === 'resource') {
            $Resource = (new Resource())->create([
                'resource_type_id' => $ResourceType->id,
                'resource_group_id' => 0,
                'name' => $resourceInfo['fileName'],
                'url' => $resourceInfo['url'],
                'info' => $info,
            ]);
            $Resource['id'] = $Resource->id;
        }
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
     * 自定义条件筛选
     * Custom filter criteria
     * @param $q
     * @param $filter
     * @return mixed
     * @throws \Exception
     */
    protected function customFilterCriteria($q, $filter)
    {
        $filter = json_decode($filter, true);
        if (!is_array($filter)) {
            throw new \Exception('请求的filter格式有误', Code::CODE_WRONG);
        }
        foreach ($filter as $id => $f) {
            $value = explode('|', $f);
            if (count($value) === 1) {
                throw new \Exception('缺少分割符|', Code::CODE_WRONG);
            }
            switch ($value[1]) {
                case '=':
                    $q->where($id, $value[0]);
                    break;
                case '!=':
                case '>':
                case '>=':
                case '<':
                case '<=':
                    $q->where($id, $value[1], $value[0]);
                    break;
                case 'include':
                    $q->where($id, 'like', "%$value[0]%");
                    break;
                case 'notinclude':
                    $q->where($id, 'not like', "%$value[0]%");
                    break;
            }
        }
        return $q;
    }
}
