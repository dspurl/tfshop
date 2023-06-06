<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
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
                            $return->typeShow = __('invoice_paid.type.system_messages');
                            break;
                        case InvoicePaid::NOTIFICATION_TYPE_DEAL:
                            $return->typeShow = __('invoice_paid.type.deal');
                            break;
                        case InvoicePaid::NOTIFICATION_TYPE_ACTIVITY:
                            $return->typeShow = __('invoice_paid.type.activity');
                            break;
                    }
                }
            }
            return $return;
        }
    }
}
