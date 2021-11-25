<?php

namespace App\Models\v1;

use App\Notifications\InvoicePaid;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed nickname
 * @property int admin_id
 * @property string path
 * @property string method
 * @property string ip
 * @property string input
 */
class Notification extends Model
{

    protected $keyType = 'string';
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

    public function getDataAttribute()
    {
        if (isset($this->attributes['data'])) {
            $return = $this->attributes['data'];
            if (self::$withoutAppends) {
            } else {
                if($this->attributes['data']){
                    $return = json_decode($this->attributes['data']);
                    switch ($return->type){
                        case InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES:
                            $return->typeShow = '系统消息';
                            break;
                        case InvoicePaid::NOTIFICATION_TYPE_DEAL:
                            $return->typeShow = '交易';
                            break;
                        case InvoicePaid::NOTIFICATION_TYPE_ACTIVITY:
                            $return->typeShow = '活动';
                            break;
                    }
                }
            }
            return $return;
        }
    }
}
