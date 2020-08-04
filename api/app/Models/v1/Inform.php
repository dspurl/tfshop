<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int apply_id
 * @property int apply_user_id
 * @property int type
 * @property int state
 * @property string title
 * @property string msg
 */
class Inform extends Model
{
    const INFORM_TYPE_SYSTEM= 1; //类型：系统消息
    const INFORM_STATE_UNREAD= 0; //类型：未读
    const INFORM_STATE_READ= 1; //类型：已读
    const INFORM_STATE_DELETE= 2; //类型：删除
    protected $appends = ['type_show','state_show','time_show'];
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
    /**
     * 发送通知
     * @param string $data
     */
    protected function setInform($data){
        $Inform=new Inform();
        $Inform->apply_id = $data['apply_id'];
        $Inform->apply_user_id = $data['apply_user_id'];
        $Inform->type = isset($data['type'])?$data['type']:static::INFORM_TYPE_SYSTEM;
        $Inform->type = isset($data['state'])?$data['state']:static::INFORM_STATE_UNREAD;
        $Inform->title = $data['title'];
        $Inform->msg = $data['msg'];
        $Inform->save();
    }

    public function getTypeShowAttribute(){
        if(isset($this->attributes['type'])){
            if($this->attributes['type'] == static::INFORM_TYPE_SYSTEM){
                return '系统消息';
            }
        }
    }
    public function getStateShowAttribute(){
        if(isset($this->attributes['state'])){
            if($this->attributes['state'] == static::INFORM_STATE_UNREAD){
                return '未读';
            }else if($this->attributes['state'] == static::INFORM_STATE_READ){
                return '已读';
            }
        }
    }

    public function getTimeShowAttribute(){
        if(isset($this->attributes['created_at'])){
            $time=strtotime($this->attributes['created_at']);
            if(date('Ymd',$time) == date('Ymd')){  //今天
                return date('H:i',$time);
            }else{
                return date('m-d',$time);
            }
        }
    }
}
