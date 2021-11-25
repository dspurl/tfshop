<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int sms_service_id
 * @property int phone
 * @property string data
 */
class SmsLog extends Model
{
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

    // 日志插入
    public function setSmsLog($data)
    {
        $SmsLog = new SmsLog();
        $SmsLog->sms_service_id = $data['sms_service_id'];
        $SmsLog->phone = $data['phone'];
        $SmsLog->data = json_encode($data['data']);
        $SmsLog->save();
    }
}
