<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed nickname
 * @property int user_id
 * @property string type
 * @property string msg
 * @property string feedback
 * @property int state
 */
class NotificationLog extends Model
{
    const NOTIFICATION_LOG_STATE_OK = 1; //状态：成功
    const NOTIFICATION_LOG_STATE_ERROR = 2; //状态：失败
    const NOTIFICATION_LOG_TYPE_MINIWEIXIN = 'miniweixin'; //类型：微信小程序
    const NOTIFICATION_LOG_TYPE_WECHAT = 'wechat'; //类型：微信公众平台
    const NOTIFICATION_LOG_TYPE_ANDROID = 'android'; //类型：安卓
    const NOTIFICATION_LOG_TYPE_IOS = 'ios'; //类型：IOS
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
}
