<?php
namespace App\common;

use App\Code;
use App\Models\v1\SmartDevice;
use App\Models\v1\SmartProject;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

/**
 *
 * Home Assistant/智能音箱数据解析类
 *
 */
class HassEchoServer
{
    /**
     * 获取Home Assistant实体列表
     * @param $user_id //用户ID
     * @param $echo_id  //智能音箱类型
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    const ECHO_SERVER=0;    //服务器
    const ECHO_ALIGENIE= 1;   //天猫音箱添加echo表的ID
    public function getHassEntityList($user_id,$echo_id){
        if(!$user_id || !$echo_id){
            //默认返回信息（包括$echo_id无值的时候）
            $return=[
                'state'=>0,
                'data'=>[
                    'code'=>'INVALIDATE_PARAMS',
                    'value' =>'invalidate params',
                ],
            ];
            if($echo_id){   //根据各智能音箱设置
                switch ($echo_id) {
                    case static::ECHO_ALIGENIE: //天猫精灵
                        $return=[
                            'state'=>0,
                            'data'=>[
                                'code'=>'INVALIDATE_PARAMS',
                                'value' =>'invalidate params',
                            ],
                        ];
                        break;
                }
            }
            return $return;
        }
        $SmartProject=SmartProject::where('user_id',$user_id)->first();
        try {
            $client = new Client(['base_uri' => $SmartProject->url.'/api/']);
            $res = $client->request('GET', 'states', [
                'headers' => [
                    'Authorization' => 'Bearer '.$SmartProject->auth,
                ],
            ]);
            $return =[];
            if($res->getStatusCode() == 200){
                foreach (json_decode($res->getBody(),true) as $body){
                    $entity_id=explode('.',$body['entity_id']);
                    if(in_array($entity_id[0],config('smartdevice.category.hass'))){
                        $SmartDevice=SmartDevice::where('marking',$entity_id[1])
                            ->with([
                                'SmartDeviceEchoCategory'=>function($q)use ($echo_id){
                                    $q->where('smart_device_echo_id',$echo_id)->select('id','value','smart_device_echo_id','smart_device_category_id');
                                },'SmartDeviceBrand'=>function($q){
                                    $q->select('id','name');
                                }
                            ])->first();
                        if($SmartDevice){
                            if(!$SmartDevice->SmartDeviceEchoCategory){
                                $return=[
                                    'state'=>0,
                                    'data'=>[
                                        'code'=>'INVALIDATE_PARAMS',
                                        'value' =>'invalidate params',
                                    ],
                                ];
                                return $return;
                            }
                            switch ($echo_id){  //为不同智能音箱设置返回数据
                                case static::ECHO_ALIGENIE:
                                    $return['data'][]=[
                                        'deviceId'      =>  $body['entity_id'],   //设备ID
                                        'deviceType'    =>  $SmartDevice->SmartDeviceEchoCategory->value,    //设备类型(取数据库)
                                        'deviceName'    =>  $SmartDevice->name,  //名称(取数据库)
                                        'brand'         =>  $SmartDevice->SmartDeviceBrand->name,    //品牌
                                        'model'         =>  $SmartDevice->model,     //型号
                                        //'zone'          =>  '主卧',    //位置
                                        'icon'          =>  $SmartDevice->icon,
                                        'actions'       => ['TurnOn','TurnOff','QueryPowerState'],  //产品支持的操作
                                        'properties' =>[       //支持的属性状态列表
                                            'name'=>'powerstate',
                                            'value' =>'off',
                                        ]
                                    ];
                                    break;
                            }

                            /*                    $return[]=array(
                                    'entity_id'  =>$body['entity_id'],
                                    'friendly_name'  =>$body['attributes']['friendly_name'],
                                    'attributes'=>$body['attributes'],
                                    'state'=>$body['state'],
                                    'last_changed'=>$body['last_changed'],
                                    'last_updated'=>$body['last_changed'],
                                );*/
                        }
                        $return['state']=1;
                    }
                }
            }
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'DEVICE_IS_NOT_EXIST',
                        'value' =>'device is not exist',
                    ],
                ];
            }else {
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'SERVICE_ERROR',
                        'value' =>'服务器异常',
                    ],
                ];
            }
        }
        return $return;
    }

    /**
     * Home Assistant控制设备
     * @param $user_id
     * @param $deviceId //实体ID
     * @param $echo_id //智能音箱类型
     * @param $service  //指令
     * @param $state    //状态结果
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function hassControlEquipment($user_id, $deviceId,$echo_id,$service,$state){
        if(!$user_id || !$deviceId || !$echo_id || !$service || !$state){
            //默认返回信息（包括$echo_id无值的时候）
            $return=[
                'state'=>0,
                'data'=>[
                    'code'=>'INVALIDATE_PARAMS',
                    'value' =>'invalidate params',
                ],
            ];
            if($echo_id){   //根据各智能音箱设置
                switch ($echo_id) {
                    case static::ECHO_ALIGENIE: //天猫精灵
                        $return=[
                            'state'=>0,
                            'data'=>[
                                'code'=>'INVALIDATE_PARAMS',
                                'value' =>'invalidate params',
                            ],
                        ];
                        break;
                }
            }
            return $return;
        }
        $SmartProject=SmartProject::where('user_id',$user_id)->first();
        try {
            ///api/services/<domain>/<service>
            //http://localhost:8123/api/services/switch/turn_on
//            {
//                "entity_id":"switch.garage_door_close_switch"
//}
            $client = new Client(['base_uri' => $SmartProject->url.'/api/']);
            $entity_id=explode('.',$deviceId);
            //根据指定转换成hass的指定
            $services='';
            switch ($echo_id) {
                case static::ECHO_ALIGENIE: //天猫精灵
                    $services=config('smartdevice.service.aligenie')[$service];
                    break;
            }
            if(!$services){
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'INVALIDATE_CONTROL_ORDER',
                        'value' =>'invalidate control order',
                    ],
                ];
                return $return;
            }
            $res = $client->request('POST', 'services/'.$entity_id[0].'/'.$services, [
                'headers' => [
                    'Authorization' => 'Bearer '.$SmartProject->auth,
                ],
                'json' => ['entity_id' => $deviceId],
            ]);
            $return=[
                'state'=>0
            ];
            if($res->getStatusCode() == 200){
                $getBody=json_decode($res->getBody(),true);
                //需要根据实际设备返回不同状态
                switch ($echo_id){
                    case static::ECHO_ALIGENIE: //天猫精灵
                        $return=[
                            'state'=>1
                        ];
                        break;
                }
            }else{
                switch ($echo_id){
                    case static::ECHO_ALIGENIE: //天猫精灵
                        $return=[
                            'state'=>0,
                            'data'=>[
                                'code'=>'SERVICE_ERROR',
                                'value' =>'服务异常',
                            ],
                        ];
                        break;
                }
            }
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'DEVICE_IS_NOT_EXIST',
                        'value' =>'device is not exist',
                    ],
                ];
            }else {
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'SERVICE_ERROR',
                        'value' =>'服务器异常',
                    ],
                ];
            }
        }
        return $return;
    }

    /**
     * Home Assistant设备状态
     * @param $user_id
     * @param $deviceId //实体ID
     * @param $echo_id  //智能音箱类型
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function hassEquipmentStatus($user_id, $deviceId,$echo_id){
        if(!$user_id || !$deviceId || !$echo_id){
            //默认返回信息（包括$echo_id无值的时候）
            $return=[
                'state'=>0,
                'data'=>[
                    'code'=>'INVALIDATE_PARAMS',
                    'value' =>'invalidate params',
                ],
            ];
            if($echo_id){   //根据各智能音箱设置
                switch ($echo_id) {
                    case static::ECHO_ALIGENIE: //天猫精灵
                        $return=[
                            'state'=>0,
                            'data'=>[
                                'code'=>'INVALIDATE_PARAMS',
                                'value' =>'invalidate params',
                            ],
                        ];
                        break;
                }
            }
            return $return;
        }
        $SmartProject=SmartProject::where('user_id',$user_id)->first();
        try {
            $client = new Client(['base_uri' => $SmartProject->url.'/api/']);

            $res = $client->request('GET', 'states/'.$deviceId, [
                'headers' => [
                    'Authorization' => 'Bearer '.$SmartProject->auth,
                ],
            ]);
            $return=[
                'state'=>0
            ];
            if($res->getStatusCode() == 200){
                $getBody=json_decode($res->getBody(),true);
                //需要根据实际设备返回不同状态
                switch ($echo_id){
                    case static::ECHO_ALIGENIE: //天猫精灵
                        if($getBody['state']=='unavailable'){
                            $return=[
                                'state'=>0,
                                'data'=>[
                                    'code'=>'IOT_DEVICE_OFFLINE',
                                    'value' =>'device is offline',
                                ],
                            ];
                        }else{
                            $return=[
                                'state'=>1,
                                'data'=>[
                                    'name'=>'powerstate',
                                    'value' =>$getBody['state'],
                                ],
                            ];
                        }
                        break;
                }
            }else{
                switch ($echo_id){
                    case static::ECHO_ALIGENIE: //天猫精灵
                        $return=[
                            'state'=>0,
                            'data'=>[
                                'code'=>'SERVICE_ERROR',
                                'value' =>'服务异常',
                            ],
                        ];
                        break;
                }
            }
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'DEVICE_IS_NOT_EXIST',
                        'value' =>'device is not exist',
                    ],
                ];
            }else {
                $return=[
                    'state'=>0,
                    'data'=>[
                        'code'=>'SERVICE_ERROR',
                        'value' =>'服务器异常',
                    ],
                ];
            }
        }
        return $return;
    }
}