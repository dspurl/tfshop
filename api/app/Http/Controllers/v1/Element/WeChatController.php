<?php

namespace App\Http\Controllers\v1\Element;

use App\Code;
use App\common\Aliyun;
use App\Models\v1\Common;
use App\Models\v1\ApplySms;
use App\Models\v1\ApplySmsTemplate;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodSku;
use App\Models\v1\MoneyLog;
use App\Models\v1\PaymentLog;
use App\Models\v1\SmsLog;
use App\Models\v1\User;
use App\Models\v1\UserLog;
use App\Notifications\InvoicePaid;
use Carbon\Carbon;
use EasyWeChat\Factory;
use App\Http\Controllers\Controller;
use EasyWeChat\Kernel\Http\StreamResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
class WeChatController  extends Controller
{
    /**
     * 处理微信的请求消息
     *
     * @param Request $request
     * @return string
     * @throws \EasyWeChat\Kernel\Exceptions\BadRequestException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \ReflectionException
     */
    public function serve(Request $request)
    {
        if(!$request->has('secret')){
            return resReturn(0,'非法操作',Code::CODE_MISUSE);
        }
        $config = config('wechat.mini_program.default');
        $app = Factory::miniProgram($config);
        $app->server->push(function($message){
            switch ($message['MsgType']) {
                case 'event':
                    return '收到事件消息';
                    break;
                case 'text':
                    return '收到文字消息';
                    break;
                case 'image':
                    return '收到图片消息';
                    break;
                case 'voice':
                    return '收到语音消息';
                    break;
                case 'video':
                    return '收到视频消息';
                    break;
                case 'location':
                    return '收到坐标消息';
                    break;
                case 'link':
                    return '收到链接消息';
                    break;
                case 'file':
                    return '收到文件消息';
                // ... 其它消息
                default:
                    return '收到其它消息';
                    break;
            }
        });
        return $app->server->serve();
    }

    //注册
    public function register(Request $request){
        if(!$request->has('cellphone')){
            return resReturn(0,'手机号不能为空',Code::CODE_WRONG);
        }
        if(!$request->has('password')){
            return resReturn(0,'密码不能为空',Code::CODE_WRONG);
        }
        if(!$request->has('rPassword')){
            return resReturn(0,'重复密码不能为空',Code::CODE_WRONG);
        }
        if($request->password != $request->rPassword){
            return resReturn(0,'重复密码和密码不相同',Code::CODE_WRONG);
        }
        $user=User::where('cellphone',$request->cellphone)->first();
        $addUser=new User();
        if($user){
            return resReturn(0,'手机号已被注册',Code::CODE_WRONG);
        }else{
            $addUser->money = 10000*100;
        }
        $addUser->name = $request->cellphone;
        $addUser->cellphone = $request->cellphone;
        $addUser->password=bcrypt($request->password);
        $addUser->api_token = hash('sha256', Str::random(60));
        $addUser->save();
        return resReturn(1,'注册成功');
    }

    //找回密码
    public function findPassword(Request $request){
        if(!$request->has('cellphone')){
            return resReturn(0,'手机号不能为空',Code::CODE_WRONG);
        }
        if(!$request->has('password')){
            return resReturn(0,'新密码不能为空',Code::CODE_WRONG);
        }
        if(!$request->has('rPassword')){
            return resReturn(0,'确认密码不能为空',Code::CODE_WRONG);
        }
        if($request->password != $request->rPassword){
            return resReturn(0,'确认密码和新密码不相同',Code::CODE_WRONG);
        }
        $user=User::where('cellphone',$request->cellphone)->first();
        $user->password=bcrypt($request->password);
        $user->save();
        return resReturn(1,'密码重置成功');
    }

    //微信用户登录/注册
    public function appUserlogin(Request $request){
        $config = config('wechat.mini_program.default');
        $miniProgram = Factory::miniProgram($config); // 小程序
        $auth=$miniProgram->auth->session((string) $request->code);
        // 生成用户
        $User=User::where('wechat_applet_openid',$auth['openid'])->first();
        if($User){   //更新用户
            $User->updated_at=Carbon::now()->toDateTimeString();
            $User->save();
            return resReturn(1,$auth);
        }else { //新建
            $return=DB::transaction(function ()use($request,$auth){
                $User=new User();
                $User->wechat_applet_openid=$auth['openid'];
                $User->save();
                return 1;
            }, 5);
            if($return == 1){
                return resReturn(1,$auth);
            }else{
                return resReturn(0,$return[0],$return[1]);
            }
        }
    }

    public function login(Request $request){
        if(!$request->has('cellphone')){
            return resReturn(0,'手机号不能为空',Code::CODE_WRONG);
        }
        if(!$request->has('password')){
            return resReturn(0,'密码不能为空',Code::CODE_WRONG);
        }
        $user=User::where('cellphone',$request->cellphone)->first();
        if(!$user){
            return resReturn(0,'手机号未注册过',Code::CODE_WRONG);
        }
        if(!$user->state == User::USER_STATE_FORBID){
            return resReturn(0,'您的账户禁止访问，请联系管理员',Code::CODE_WRONG);
        }
        if (!Hash::check($request->password, $user->password)) {
            return resReturn(0,'密码错误',Code::CODE_WRONG);
        }
        if(!$user->api_token){
            $user->api_token = hash('sha256', Str::random(60));

        }
        $user->updated_at=Carbon::now()->toDateTimeString();
        $user->save();
        $input = $request->all();
        $log = new UserLog();
        $log->user_id = $user->id;
        $log->path = $request->path();
        $log->method = $request->method();
        $log->ip = $request->ip();
        $log->input = json_encode($input, JSON_UNESCAPED_UNICODE);
        $log->save();   # 记录日志
        return [
            'nickname'=>$user->nickname,
            'cellphone'=>$user->cellphone,
            'portrait'=>$user->portrait,
            'api_token'=>$user->api_token
        ];
    }

    //登出
    public function logout(Request $request){
        $input = $request->all();
        $log = new UserLog();
        $log->user_id = auth('web')->user()->id;
        $log->path = $request->path();
        $log->method = $request->method();
        $log->ip = $request->ip();
        $log->input = json_encode($input, JSON_UNESCAPED_UNICODE);
        $log->save();   # 记录日志
        return resReturn(1,'退出成功');
    }

    //注册手机验证码
    public function getRegisterCellphoneCode(Request $request){
        $redis = Redis::connection('default');
        if(!$request->has('cellphone')){
            return resReturn(0,'手机号不能为空',Code::CODE_WRONG);
        }
        $user=User::where('cellphone',$request->cellphone)->first();
        if(!$request->has('state')){
            if($user){
                return resReturn(0,'手机号已被注册',Code::CODE_WRONG);
            }
        }else{
            if(!$user){
                return resReturn(0,'手机号不存在',Code::CODE_WRONG);
            }
        }
        $code=rand(10000, 99999);
        $redis->setex('code.register.'.$request->cellphone,300,json_encode([
            'code'=>$code,
            'failuretime'=>config('dswjcms.failuretime'),
        ]));
        return resReturn(1,['code'=>$code]);  //不走接口，直接返回验证码
        $return=$this->getCode(1,$request->cellphone,$code);
        if($return['Code'] == "OK"){
            return resReturn(1,'成功');
        }else{
            $redis->del('code.register.'.$request->cellphone);
            return resReturn(0,$return['Message'],Code::CODE_WRONG);
        }
    }

    /**
     * @param $apply_id //短信商ID
     * @param $cellphone //手机号
     * @param $code //验证码
     * @internal param $applySecret
     * @return string
     */
    protected function getCode($apply_id,$cellphone,$code){
        $aliyunConfig = config('sms.aliyun');
        $config=[
            'accessKeyId'=>$aliyunConfig['access_id'],
            'accessSecret'=>$aliyunConfig['secret'],
            'SignName'=>$aliyunConfig['signature'],
            'TemplateCode'=>$aliyunConfig['verification_code'],
        ];
        $Aliyun=new Aliyun();
        $return =$Aliyun->sendCode($config,$cellphone,$code);

        SmsLog::setSmsLog(array(
            'sms_service_id'=>$apply_id,
            'phone'=>$cellphone,
            'data'=>$return
        ));
        return $return;
    }

    /**
     * 余额支付
     * @param Request $request
     * @return string
     */
    public function balancePay(Request $request){
        if(!$request->id){
            return resReturn(0,'参数有误',Code::CODE_PARAMETER_WRONG);
        }
        $GoodIndent=GoodIndent::with(['goodsList'])->find($request->id);
        $User = User::find(auth('web')->user()->id);
        if($User->money < $GoodIndent->total){  //余额小于需要支付的费用
            return resReturn(0,'账户余额不足，无法完成订单',Code::CODE_PARAMETER_WRONG);
        }
        foreach ($GoodIndent->goodsList as $indentCommodity){
            $Good=Good::select('id','is_inventory','inventory')->find($indentCommodity['good_id']);
            if($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_FILM){ //付款减库存
                if(!$indentCommodity['good_sku_id']){ //非SKU商品
                    if($Good->inventory-$indentCommodity['number']<0){
                        return resReturn(0,'存在库存不足的商品，请重新购买',Code::CODE_PARAMETER_WRONG);
                    }
                    $Good->inventory = $Good->inventory-$indentCommodity['number'];
                    $Good->save();
                }else{
                    $GoodSku=GoodSku::find($indentCommodity['good_sku_id']);
                    if($GoodSku->inventory-$indentCommodity['number']<0){
                        return resReturn(0,'存在库存不足的SKU商品，请重新购买',Code::CODE_PARAMETER_WRONG);
                    }
                    $GoodSku->inventory = $GoodSku->inventory-$indentCommodity['number'];
                    $GoodSku->save();
                }
            }
        }
        $return=DB::transaction(function ()use($request,$GoodIndent){
            User::where('id',auth('web')->user()->id)->decrement('money', $GoodIndent->total);
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
            $GoodIndent->pay_time= Carbon::now()->toDateTimeString();
            $GoodIndent->save();
            $Money=new MoneyLog();
            $Money->user_id = auth('web')->user()->id;
            $Money->type = MoneyLog::MONEY_LOG_TYPE_EXPEND;
            $Money->money = $GoodIndent->total;
            $Money->remark = '对订单：'.$GoodIndent->identification.'的付款';
            $Money->save();
            // 通知
            $invoice=[
               'type'=> InvoicePaid::NOTIFICATION_TYPE_DEAL,
                'title'=>'对订单：'.$GoodIndent->identification.'的付款',
                'list'=>[
                    [
                        'keyword'=>'支付方式',
                        'data'=>'余额支付'
                    ]
                ],
                'price'=>$GoodIndent->total,
                'url'=>'/pages/finance/bill_show?id='.$Money->id,
                'prefers'=>['database']
            ];
            $user = User::find(auth('web')->user()->id);
            $user->notify(new InvoicePaid($invoice));
            return array(1,'支付成功');
        });
        if($return[0] == 1){
            return resReturn(1,$return[1]);
        }else{
            return resReturn(0,$return[0],$return[1]);
        }

    }

    /**
     * 微信支付
     * @param Request $request
     * @return string
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidConfigException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function payment(Request $request){
        $openid=$request->header('openid');
        if(!$openid){
            return resReturn(0,'仅支持微信小程序支付',Code::CODE_WRONG);
        }
        $config = config('wechat.payment.default');
        $config['notify_url'] = request()->root().'/api/v1/app/paymentNotify';    // 你也可以在下单时单独设置来想覆盖它
        $GoodIndent=GoodIndent::with(['goodsList'])->find($request->id);
        $app = Factory::payment($config);
        $body='对订单：'.$GoodIndent->identification.'的付款';
        $result = $app->order->unify([
            'body' => $body,
            'out_trade_no' => $number= orderNumber(),
            'total_fee' => $GoodIndent->total,
//            'total_fee' => 1,
            'trade_type' => 'JSAPI', // 请对应换成你的支付方式对应的值类型
            'openid' => $openid,
        ]);
        if ($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS') {
            $prepayId = $result['prepay_id'];
            $config = $app->jssdk->sdkConfig($prepayId);
            $PaymentLog = new PaymentLog();
            $PaymentLog->name = $body;
            $PaymentLog->number = $number;
            $PaymentLog->money = $GoodIndent->total;
            $PaymentLog->pay_id = $request->id; //订单ID
            $PaymentLog->pay_type = 'App\Models\v1\GoodIndent';
            $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_CREATE;
            $PaymentLog->save();
            //库存判断
            foreach ($GoodIndent->goodsList as $indentCommodity){
                $Good=Good::select('id','is_inventory','inventory')->find($indentCommodity['good_id']);
                if($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_FILM){ //付款减库存
                    if(!$indentCommodity['good_sku_id']){ //非SKU商品
                        if($Good->inventory-$indentCommodity['number']<0){
                            return resReturn(0,'存在库存不足的商品，请重新购买',Code::CODE_PARAMETER_WRONG);
                        }
                        $Good->inventory = $Good->inventory-$indentCommodity['number'];
                        $Good->save();
                    }else{
                        $GoodSku=GoodSku::find($indentCommodity['good_sku_id']);
                        if($GoodSku->inventory-$indentCommodity['number']<0){
                            return resReturn(0,'存在库存不足的SKU商品，请重新购买',Code::CODE_PARAMETER_WRONG);
                        }
                        $GoodSku->inventory = $GoodSku->inventory-$indentCommodity['number'];
                        $GoodSku->save();
                    }
                }
            }
            return resReturn(1,$config);
        }
        if ($result['return_code'] == 'FAIL' && array_key_exists('return_msg', $result)) {
            return resReturn(0,$result['return_msg'],Code::CODE_WRONG);
        }
        return resReturn(0,$result['err_code_des'],Code::CODE_WRONG);
    }

    /**
     * 微信支付回调
     * @param Request $request
     * @return string
     * @throws \EasyWeChat\Kernel\Exceptions\Exception
     */
    public function paymentNotify(Request $request){
        $config = config('wechat.payment.default');
        $config['notify_url'] = request()->root().'/api/v1/app/paymentNotify';    // 你也可以在下单时单独设置来想覆盖它
        $app = Factory::payment($config);
        $response = $app->handlePaidNotify(function ($message, $fail)
        {
//            Log::info('小程序:'.json_encode($message));
            // 根据返回的订单号查询订单数据
            $order = PaymentLog::where('number',$message['out_trade_no'])->first();
            if (!$order || $order->state == PaymentLog::PAYMENT_LOG_STATE_COMPLETE) {
                return true;
            }
            // 支付成功后的业务逻辑
            if ($message['return_code'] === 'SUCCESS') { // return_code 表示通信状态，不代表支付状态
                // 用户是否支付成功
                if ($message['result_code'] === 'SUCCESS') {
//                    $PaymentLog = PaymentLog::find($order->id);
                    $order->state = PaymentLog::PAYMENT_LOG_STATE_COMPLETE;
                    $order->transaction_id = $message['transaction_id'];
                    $order->data = json_encode($message);
                    $order->save();
                    // 业务代码
                    $GoodIndent=GoodIndent::find($order['pay_id']);
                    $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
                    $GoodIndent->pay_time= Carbon::now()->toDateTimeString();
                    $GoodIndent->save();
                    $Money=new MoneyLog();
                    $Money->user_id = $GoodIndent->user_id;
                    $Money->type = MoneyLog::MONEY_LOG_TYPE_EXPEND;
                    $Money->money = $order->money;
                    $Money->remark = '对订单：'.$GoodIndent->identification.'的付款';
                    $Money->save();
                    // 通知
                    $invoice=[
                        'type'=> InvoicePaid::NOTIFICATION_TYPE_DEAL,
                        'title'=>'对订单：'.$GoodIndent->identification.'的付款',
                        'list'=>[
                            [
                                'keyword'=>'支付方式',
                                'data'=>'微信支付'
                            ]
                        ],
                        'price'=>$order->money,
                        'url'=>'/pages/finance/bill_show?id='.$Money->id,
                        'prefers'=>['database']
                    ];
                    $user = User::find($GoodIndent->user_id);
                    $user->notify(new InvoicePaid($invoice));
                    // 用户支付失败
                } elseif ($message['result_code'] === 'FAIL') {
                    $order->status = 'paid_fail';
                }
            } else {
                return $fail('Order not exists.');
            }

            return true;
        });
        return $response;
    }
}
