<?php

namespace App\Providers;

use App\common\RedisService;
use App\Models\v1\Config;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;

class ConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadMyConfig();
    }

    protected function loadMyConfig()
    {
        $redis = new RedisService();
//        $redis->del('config');
        if (!$redis->get('config')) {
            // 没有缓存说明配置有更新或未生成过
            // 导入配置到数据库
            $count = Config::count();
            if ($count == 0) {
                $config = config('dsshop.config');
                $this->addConfig($config);
            }
            // 获取配置
            $config = Config::where('keys', '!=', null)->select('keys', 'value')->get()->toArray();
            $redis->set('config', json_encode($config));
        } else {
            $config = json_decode($redis->get('config'), true);
        }
        // 合并配置文件和数据库配置文件
        foreach ($config as $c) {
            config([$c['keys'] => $c['value']]);
        }
    }

    protected function addConfig($configs, $ids = 0)
    {
        $id = $ids;
        foreach ($configs as $c) {
            $Config = new Config();
            $Config->parent_id = $id;
            $Config->name = $c['name'];
            $Config->maxlength = isset($c['maxlength']) ? $c['maxlength'] : null;
            $Config->required = isset($c['required']) ? $c['required'] : 0;
            $Config->remark = isset($c['remark']) ? $c['remark'] : null;
            $Config->input_type = isset($c['input_type']) ? $c['input_type'] : null;
            $Config->input_option = isset($c['input_option']) ? $c['input_option'] : null;
            $Config->keys = isset($c['keys']) ? $c['keys'] : null;
            $Config->value = isset($c['value']) ? $c['value'] : null;
            $Config->style = isset($c['style']) ? $c['style'] : null;
            $Config->save();
            if (isset($c['children'])) {
                $this->addConfig($c['children'], $Config->id);
            }
        }
    }
}
