<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int apply_id
 * @property int parameter
 * @property int cause
 * @property int other_parameter
 * @property int type
 * @property string complainant_ip
 */
class Complaint extends Model
{
    const COMPLAINT_CAUSE_EROTICISM= 1; //投诉原因：色情
    const COMPLAINT_CAUSE_CHEAT= 2; //投诉原因：欺诈信息
    const COMPLAINT_CAUSE_VIOLENCE= 3; //投诉原因：暴力恐怖
    const COMPLAINT_CAUSE_SENSITIVE= 4; //投诉原因：政治敏感信息
    const COMPLAINT_CAUSE_GAMBLE= 5; //投诉原因：赌博
    const COMPLAINT_TYPE_LIVE_CODE= 1; //类型：活码

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    //活码
    public function LiveCode()
    {
        return $this->hasOne(LiveCode::class,'id','parameter');
    }

    //活码对应的实际二维码
    public function LiveThirdCode(){
        return $this->hasOne(LiveThirdCode::class,'id','other_parameter');
    }
}
