<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\common\RedisService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * @group [ADMIN]Backup(备份管理)
 * Class BackupController
 * @package App\Http\Controllers\v1\Admin
 */
class BackupController extends Controller
{
    /**
     * BackupList
     * 备份列表
     * @param Request $request
     * @return string
     */
    public function list(Request $request)
    {
        $data = Storage::disk('root')->files('api/storage/app/'.config('backup.backup.name'));
        $return = [];
        foreach ($data as $d) {
            $fileName = basename($d);
            $outputString = preg_replace('/[^0-9]/', '', $fileName);
            $sizeFile = Storage::disk('root')->size($d);
            if ($sizeFile > 1024 * 1024 * 1024) {  //GB
                $size = round($sizeFile / (1024 * 1024 * 1024), 2) . ' GB';
            } else if ($sizeFile > 1024 * 1024) { //MB
                $size = round($sizeFile / (1024 * 1024), 2) . ' MB';
            } else { //B
                $size = round($sizeFile / 1024, 2) . ' KB';
            }
            $zip = new \ZipArchive();
            $zip_file = storage_path('app/'.config('backup.backup.name') .'/'. $fileName);
            $zipStatus = $zip->open($zip_file);
            if($zipStatus !== true){
                throw new \Exception(__('backup.error.zip').$zipStatus, Code::CODE_INEXISTENCE);
            }
            // db
            if (strpos($zip->getNameIndex(0), 'db-dumps') !== false && $request->type == 'db') {
                $return[] = [
                    'name' => $fileName,
                    'time' => date('Y-m-d H:i:s', strtotime($outputString)),
                    'size' => $size,
                ];

            } else if (strpos($zip->getNameIndex(0), 'db-dumps') === false && $request->type == 'file') {
                $return[] = [
                    'name' => $fileName,
                    'time' => date('Y-m-d H:i:s', strtotime($outputString)),
                    'size' => $size,
                ];
            }
            $zip->close();
        }
        $return = collect($return)->sortByDesc('time')->values()->all();
        return resReturn(1, $return);
    }

    /**
     * BackupCreate
     * 备份
     * @param Request $request
     * @return string
     * @queryParam  type int 类型 db:数据库 file:文件
     */
    public function create(Request $request)
    {
        if ($request->type == 'db') {
            Artisan::call('backup:run --only-db');
        } else {
            Artisan::queue('backup:run --only-files');
        }
        return resReturn(1, __('common.succeed'));
    }

    /**
     * BackupEdit
     * 还原
     * @param Request $request
     * @queryParam  name string 备份文件名称
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function edit(Request $request, $id)
    {
        // 解压安装包
        shell_exec("cd ../storage/app/".config('backup.backup.name')."/ && unzip " . $request->name);
        shell_exec("cd ../storage/app/".config('backup.backup.name')."/db-dumps/ && gunzip mysql-".config('backup.backup.name').".sql.gz");
        try {
            DB::unprepared(Storage::disk('root')->get('/api/storage/app/'.config('backup.backup.name').'/db-dumps/mysql-'.config('backup.backup.name').'.sql'));
        } catch (\Exception $e) {
            throw new \Exception($e->getPrevious(), Code::CODE_WRONG);
        }
        Storage::disk('root')->deleteDirectory('/api/storage/app/'.config('backup.backup.name').'/db-dumps');
        // 清除配置缓存
        $redis = new RedisService();
        $redis->del('config');
        return resReturn(1, __('common.succeed'));
    }

    /**
     * BackupDestroy
     * 删除备份
     * @param int $id int 1：单文件删除 0：批量删除
     * @param Request $request
     * @return string
     * @queryParam  name string 备份文件名称
     */
    public function destroy($id, Request $request)
    {
        if ($id == 1) {
            // 删除单文件
            Storage::disk('root')->delete('/api/storage/app/'.config('backup.backup.name').'/' . $request->name);
        } else {
            foreach ($request->all() as $all) {
                Storage::disk('root')->delete('/api/storage/app/'.config('backup.backup.name').'/' . $all['name']);
            }
        }
        return resReturn(1, __('hint.succeed.win', ['attribute' => __('common.delete')]));
    }
}
