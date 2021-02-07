<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

/**
 * @property string password
 * @property string name
 * @property string email
 * @property string portrait
 * @property string last_login_at
 * @property int type
 * @property int cellphone
 */
class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;
    const ADMIN_STATA_NORMAL = 1; //正常
    const ADMIN_STATA_FORBID = 2; //禁止访问

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

    public function scopeQueryTitle($query, $title)
    {
        if ($title) {
            return $query->where('id', $title)->orWhere('name', 'like', '%' . $title . '%');
        }
    }

    // 角色
    protected function role($db)
    {
        foreach ($db as $id => $data) {
            if ($data->authGroup->count() > 0) {
                foreach ($data->authGroup as $auth_group) {
                    $data->group = $auth_group['introduction'] . ' ';
                }
            } else {
                $data->group = '未分配';
            }
        }
    }


    /**
     * 通过用户名找到对应的用户信息
     *
     * @param string $username
     * @return \App\User
     */
    public function findForPassport($username)
    {
        return $this->where('name', $username)->first();
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    public function AuthGroup()
    {
        return $this->belongsToMany(AuthGroup::class);
    }
}
