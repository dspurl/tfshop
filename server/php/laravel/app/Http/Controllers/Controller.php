<?php

namespace App\Http\Controllers;

use App\Code;
use App\Http\Requests\v1\SubmitResourceUploadRequest;
use App\Models\v1\ResourceType;

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

    /**
     * 资源上传
     * Resource upload
     * @param SubmitResourceUploadRequest $request
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
            'type'  => $file->getClientMimeType(),
            'originalName' => $file->getClientOriginalName(),
            "size" => $file->getSize()
        ];
        if (count($ResourceType->extension) != 0 && !in_array($info['extension'], $ResourceType->extension)) {
            return resReturn(0, '文件格式有误', Code::CODE_PARAMETER_WRONG);
        }
        if ($ResourceType->size != 0 && $info['size'] > $ResourceType->size) {
            return resReturn(0, '资源大小超出配置大小' . $ResourceType->size . 'B', Code::CODE_PARAMETER_WRONG);
        }
        $randFileName = str_random(5) . time();
        $fileName = $randFileName . '.' . $info['extension'];
        $pathName = 'temporary/' . $fileName;
        $files = file_get_contents($file->getRealPath());
        $disk = Storage::disk('public');
        $disk->put($pathName, $files);
        $url = request()->root() . '/storage/' . $pathName;
        return array(
            "state" => "SUCCESS",                               //上传状态，上传成功时必须返回"SUCCESS"
            "url" => $url,                                      //返回的地址
            "name" => $fileName,                                //新文件名
            "original" => $info['originalName'],                //原始文件名
            "type" => $info['type'],                            //文件类型
            "size" => $info['size']                             //文件大小
        );
    }
}
