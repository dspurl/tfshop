<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property int children_id
 * @property int parent_id
 * @property int level
 */
class UserRelation extends Model
{
    const USER_RELATION_LEVEL_ONE_LEVEL = 1; //用户等级:一级
    const USER_RELATION_LEVEL_SECOND_LEVEL = 2; //用户等级:二级
    const USER_RELATION_LEVEL_THREE_LEVEL = 3; //用户等级:三级
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
    public function User()
    {
        return $this->hasMany(User::class);
    }

    /**
     * 用户关系
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function UserRelation()
    {
        return $this->hasOne(UserRelation::class, 'children_id', 'parent_id');
    }
}
