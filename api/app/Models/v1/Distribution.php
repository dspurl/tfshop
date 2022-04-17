<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int id
 * @property string name
 * @property string identification
 * @property int level
 * @property int state
 */
class Distribution extends Model
{
    use SoftDeletes;
    const DISTRIBUTION_LEVEL_ONE_LEVEL = 1; //分销级别:一级
    const DISTRIBUTION_LEVEL_SECOND_LEVEL = 2; //分销级别:二级
    const DISTRIBUTION_LEVEL_THREE_LEVEL = 3; //分销级别:三级
    const DISTRIBUTION_STATE_OPEN = 0; //状态:打开
    const DISTRIBUTION_STATE_CLOSE = 1; //状态:关闭
    // 奖励事件，这里为填写常量，如后台选择了注册奖励现金，请修改这里的值为后台定义的identification值，也可不使用常量，前台直接定死identification的值，后台管理人员通过选择identification进行配置
    const DISTRIBUTION_IDENTIFICATION_REGISTRATION__CASH = 'sys_registration_cash';    //奖励事件：注册奖励现金
    public static $withoutAppends = true;

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * 关联分销规则
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function DistributionRule()
    {
        return $this->hasMany(DistributionRule::class);
    }
}
