<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;

/**
 * @group [ADMIN]Update(更新)
 * Class UpdateController
 * @package App\Http\Controllers\v1\Admin
 */
class UpdateController extends Controller
{

    /**
     * UpdateDetail
     * 更新详情
     * @return string
     * @throws \Exception
     */
    public function detail()
    {
        // 需要处理跨版本升级
        $update = config('dsshop.updateGithub');
        $appVersion = config('dsshop.appVersion');
        try {
            $client = new Client();
            $respond = $client->get($update);
            $Contents = json_decode($respond->getBody()->getContents(), true);
            $index = -1;
            $new = [
                'state' => 0,    //0:无更新 1：有更新 2:无法获取
                'version' => $appVersion,    //当前版本
                'new_version' => $appVersion,  // 最新版本
                'body' => '',    // 更新内容
                'zip' => '',    // 下载地址
            ];
            if (count($Contents)) {
                // 获取和当前版本匹配的版本号
                foreach ($Contents as $id => $c) {
                    if ($c['name'] == $appVersion) {
                        $index = $id;
                    }
                }
                if ($index == -1) {
                    // 没有匹配的版本号，取最老一版本
                    $index = count($Contents) - 1;
                } else if ($index === 0) {
                    // 如果有匹配的，又是第一个的话，则是最新
                    return resReturn(1, $new);
                } else {
                    // 如果是中间版本，则取比中间版本高一版本
                    $index = $index - 1;
                }
                $new['state'] = 1;
                $new['new_version'] = $Contents[$index]['name'];
                $new['body'] = $Contents[$index]['body'];
                $new['zip'] = $Contents[$index]['zipball_url'];
            }
            return resReturn(1, $new);
        } catch (\Exception $e) {
            return resReturn(1, [
                'state' => 2,
                'version' => $appVersion,
                'new_version' => $appVersion,
                'body' => '',
                'zip' => '',
            ]);
        }
    }

    /**
     * UpdateEdit
     * 更新提交
     * @param $step
     * @param Request $request
     * @return string
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     * @queryParam step int 步骤
     * @queryParam new_version string 新版本
     * @queryParam zip string 下载地址
     */
    public function edit($step, Request $request)
    {
        $appVersion = config('dsshop.appVersion');
        if ($step == 0) {
            // 下载更新包
            if ($request->new_version == $appVersion) {
                return resReturn(1, [
                    'state' => 2, // 1:安装中2:已完成3：失败
                    'message' => '<div style="color: #F56C6C;">误操作，请联系管理员</div>',
                    'step' => 1
                ]);
            }
            try {
                $client = new Client();
                $respond = $client->get($request->zip);
                Storage::disk('root')->put('Update/' . $request->new_version . '.zip', $respond->getBody()->getContents());
                return resReturn(1, [
                    'state' => 1,
                    'message' => '<div>下载更新包<span style="color: #67C23A;margin-left: 20px;">成功</span></div>',
                    'step' => 1
                ]);
            } catch (\Exception $e) {
                throw new \Exception($e->getMessage(), Code::CODE_WRONG);
            }
        } else if ($step == 1) {
            // 解压安装包
            $shell_exec = shell_exec("cd ../../Update && unzip " . $request->new_version . ".zip -d " . $request->new_version . "/");
            Storage::disk('root')->delete("Update/" . $request->new_version . ".zip");
            if (strstr($shell_exec, "Archive")) {
                return resReturn(1, [
                    'state' => 1,
                    'message' => '<div>解压更新包<span style="color: #67C23A;margin-left: 20px;">成功</span></div>',
                    'step' => 2
                ]);
            } else {
                return resReturn(1, [
                    'state' => 3,
                    'message' => '<div style="color: #F56C6C;">更新包压缩包不存在</div>',
                    'step' => 1
                ]);
            }
        } else if ($step == 2) {
            // 替换文件
            if (Storage::disk('root')->exists("/Update/" . $request->new_version)) {
                $catalogue = Storage::disk('root')->directories("/Update/" . $request->new_version);
            } else {
                return resReturn(1, [
                    'state' => 3,
                    'message' => '<div style="color: #F56C6C;">更新包目录不存在</div>',
                    'step' => 2
                ]);
            }
            if (Storage::disk('root')->exists($catalogue[0] . '/update.json')) {
                $updateJson = json_decode(Storage::disk('root')->get($catalogue[0] . '/update.json'), true);
                $step = '';
                // 执行安装
                foreach ($updateJson['file'] as $file) {
                    if ($file['behavior'] == 1) {
                        // 添加
                        $step .= "<div>添加" . $file['file'] . '<span style="color: #67C23A;margin-left: 20px;">成功</span></div>';
                        if (Storage::disk('root')->exists($catalogue[0] . '/Update' . $file['file'])) {
                            // 存在相同文件就删除
                            if (Storage::disk('root')->exists($file['file'])) {
                                if (is_dir($file['file'])) {   // 目录
                                    Storage::deleteDirectory($file['file']);
                                } else {
                                    Storage::disk('root')->delete($file['file']);
                                }
                            }
                            Storage::disk('root')->copy($catalogue[0] . '/Update' . $file['file'], $file['file']);
                        } else {
                            return resReturn(1, [
                                'state' => 3,
                                'message' => '<div style="color: #F56C6C;">缺少文件/目录：' . $catalogue[0] . $file['file'] . '</div>',
                                'step' => 2
                            ]);
                        }
                    } else if ($file['behavior'] == 2) {
                        // 替换将先删除目标文件，再进行拷贝
                        $step .= "<div>替换" . $file['file'] . '<span style="color: #67C23A;margin-left: 20px;">成功</span></div>';
                        // 保存目标文件
                        if (Storage::disk('root')->exists($file['file'])) {
                            if (!Storage::disk('root')->exists('/Update/backup/' . $request->new_version . $file['file'])) {
                                Storage::disk('root')->copy($file['file'], '/Update/backup/' . $request->new_version . $file['file']);
                            }
                        }
                        if (Storage::disk('root')->exists($catalogue[0] . '/Update' . $file['file'])) {
                            if (Storage::disk('root')->exists($file['file'])) {
                                if (is_dir($file['file'])) {   // 目录
                                    Storage::deleteDirectory($file['file']);
                                } else {
                                    Storage::disk('root')->delete($file['file']);
                                }
                                Storage::disk('root')->copy($catalogue[0] . '/Update' . $file['file'], $file['file']);
                            }
                        } else {
                            return resReturn(1, [
                                'state' => 3,
                                'message' => '<div style="color: #F56C6C;">缺少文件/目录：' . $catalogue[0] . $file['file'] . '</div>',
                                'step' => 2
                            ]);
                        }
                    } else if ($file['behavior'] == 3) {
                        // 移动将从原文件/目录移动到目标目录/文件
                        $step .= '<div>' . $file['file'] . "移动到" . $file['to'] . '<span style="color: #67C23A;margin-left: 20px;">成功</span></div>';
                        if (Storage::disk('root')->exists($file['file'])) {
                            Storage::disk('root')->move($file['file'], $file['to']);
                        }
                    } else {
                        $step .= '<div>删除' . $file['file'] . '<span style="color: #67C23A;margin-left: 20px;">成功</span></div>';
                        if (Storage::disk('root')->exists($file['file'])) {
                            if (!Storage::disk('root')->exists('/Update/backup/' . $request->new_version . $file['file'])) {
                                Storage::disk('root')->copy($file['file'], '/Update/backup/' . $request->new_version . $file['file']);
                            }
                        }
                        // 删除
                        if (is_dir($file['file'])) {   // 目录
                            Storage::deleteDirectory($file['file']);
                        } else {
                            Storage::disk('root')->delete($file['file']);
                        }
                    }

                }
                $step .= '<div style="color: #67C23A;margin-left: 20px;">成功更新到' . $request->new_version . '</div>';
                // 删除更新包
                Storage::disk('root')->deleteDirectory("Update/" . $request->new_version);
                // 修改dsshop的版本号
                $dsshop = Storage::disk('root')->get('api/config/dsshop.php');
                $dsshop = str_replace("'appVersion' => '$appVersion'", "'appVersion' => '$request->new_version'", $dsshop);
                Storage::disk('root')->put('api/config/dsshop.php', $dsshop);
                return resReturn(1, [
                    'state' => 2,
                    'message' => $step,
                    'step' => 2
                ]);
            } else {
                return resReturn(1, [
                    'state' => 3,
                    'message' => '<div style="color: #F56C6C;">更新包缺少update.json</div>',
                    'step' => 2
                ]);
            }
        }
    }
}
