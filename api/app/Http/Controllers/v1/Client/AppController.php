<?php

namespace App\Http\Controllers\v1\Client;

use App\Code;
use App\common\Aliyun;
use App\common\RedisService;
use App\Mail\VerificationCode;
use App\Models\v1\Good;
use App\Models\v1\GoodIndent;
use App\Models\v1\GoodSku;
use App\Models\v1\PaymentLog;
use App\Models\v1\SmsLog;
use App\Models\v1\User;
use App\Services\Entrance;
use Carbon\Carbon;
use EasyWeChat\Factory;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

/**
 * application
 * 应用程序
 * Class WeChatController
 * @package App\Http\Controllers\v1\Client
 */
class AppController extends Controller
{
    /**
     * serve
     * 处理应用的请求消息
     *
     * @param Request $request
     * @return string
     */
    public function serve(Request $request)
    {
        if (!$request->has('client')) {
            return resReturn(0, '非法操作', Code::CODE_MISUSE);
        }
        $Entrance = (new Entrance($request->client))->informationDistribution();
        return $Entrance;
    }

    /**
     * PaymentNotify
     * 支付回调
     * @param Request $request
     * @return string
     * @throws \EasyWeChat\Kernel\Exceptions\Exception
     */
    public function paymentNotify(Request $request)
    {
        $config = config('wechat.payment.default');
        $app = Factory::payment($config);
        $response = $app->handlePaidNotify(function ($message, $fail) {
            // 根据返回的订单号查询订单数据
            $order = PaymentLog::where('number', $message['out_trade_no'])->first();
            if (!$order || $order->state > PaymentLog::PAYMENT_LOG_STATE_CREATE) {
                return true;
            }
            // 支付成功后的业务逻辑
            if ($message['return_code'] === 'SUCCESS') { // return_code 表示通信状态，不代表支付状态
                // 用户是否支付成功
                if ($message['result_code'] === 'SUCCESS') {
                    $order->state = PaymentLog::PAYMENT_LOG_STATE_COMPLETE;
                    $order->transaction_id = $message['transaction_id'];
                    $order->data = json_encode($message);
                    $order->save();
                    // 用户支付失败
                } elseif ($message['result_code'] === 'FAIL') {
                    $order->state = PaymentLog::PAYMENT_LOG_STATE_FAILURE;
                    $order->transaction_id = $message['transaction_id'];
                    $order->data = json_encode($message);
                    $order->save();
                }
            } else {
                return $fail('Order not exists.');
            }
            return true;
        });
        return $response;
    }

    /**
     * RefundNotify
     * 退款回调
     * @param Request $request
     * @return string
     * @throws \EasyWeChat\Kernel\Exceptions\Exception
     */
    public function refundNotify(Request $request)
    {
        $config = config('wechat.payment.default');
        $app = Factory::payment($config);
        $response = $app->handleRefundedNotify(function ($message, $reqInfo, $fail) {
            // 根据返回的订单号查询订单数据
            $PaymentLog = PaymentLog::where('number', $reqInfo['out_trade_no'])->first();
            if (!$PaymentLog || $PaymentLog->state > PaymentLog::PAYMENT_LOG_STATE_CREATE) {
                return true;
            }
            // 支付成功后的业务逻辑
            if ($message['return_code'] === 'SUCCESS') {
                if ($message['return_code'] === 'SUCCESS') {
                    $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_COMPLETE;
                    $PaymentLog->transaction_id = $reqInfo['transaction_id'];
                    $PaymentLog->data = json_encode($reqInfo);
                    $PaymentLog->save();
                    // 用户支付失败
                } elseif ($message['result_code'] === 'FAIL') {
                    $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_FAILURE;
                    $PaymentLog->transaction_id = $message['transaction_id'];
                    $PaymentLog->data = json_encode($message);
                    $PaymentLog->save();
                }
            } else {
                return $fail('Order not exists.');
            }
            return true;
        });
        return $response;
    }

    /**
     * CellphoneCode
     * 手机验证码
     * @param Request $request
     * @return string
     * @throws \AlibabaCloud\Client\Exception\ClientException
     * @queryParam  cellphone int 手机号
     * @queryParam  state int 验证码类型 1找回密码 2更换手机
     */
    public function cellphoneCode(Request $request)
    {
        $redis = new RedisService();
        if (!$request->has('cellphone')) {
            return resReturn(0, '手机号不能为空', Code::CODE_WRONG);
        }
        $user = User::where('cellphone', $request->cellphone)->first();
        if (!$request->has('state')) {
            if ($user) {
                return resReturn(0, '手机号已被注册', Code::CODE_WRONG);
            }
        } else {
            if ($request->state == 2) {
                if ($user) {
                    if ($user->id != auth('web')->user()->id) {
                        return resReturn(0, '手机号已绑定其它账号，请更换手机号', Code::CODE_WRONG);
                    }
                }
            } else {
                if (!$user) {
                    return resReturn(0, '手机号不存在', Code::CODE_WRONG);
                }
            }

        }
        if ($redis->get('code.register.' . $request->cellphone)) {
            return resReturn(0, '您的验证码还没有失效，请不要重复获取', Code::CODE_WRONG);
        }
        $code = rand(10000, 99999);
        $redis->setex('code.register.' . $request->cellphone, config('dsshop.failuretime'), $code);
        $Config = config('sms');
        if (!$Config[$Config['service']]['access_id']) {    //没有配置短信账号，直接返回验证码
            return resReturn(1, ['code' => $code]);
        }
        $return = $this->getCode($Config['service'], $request->cellphone, $code);
        if ($return['Code'] == "OK") {
            return resReturn(1, '成功');
        } else {
            $redis->del('code.register.' . $request->cellphone);
            return resReturn(0, $return['Message'], Code::CODE_WRONG);
        }
    }

    /**
     * EmailCode
     * 邮箱验证码
     * @param Request $request
     * @return string
     * @queryParam  email string 邮箱
     * @queryParam  oldEmail string 旧的邮箱
     */
    public function emailCode(Request $request)
    {
        if (!$request->email) {
            return resReturn(0, '邮箱不能为空', Code::CODE_WRONG);
        }
        if ($request->oldEmail) {
            if (auth('web')->user()->email != $request->oldEmail) {
                return resReturn(0, '请求参数有误', Code::CODE_MISUSE);
            }
            if (auth('web')->user()->email == $request->email) {
                return resReturn(0, '您的邮箱已认证，无需再次验证', Code::CODE_WRONG);
            }
        }
        $user = User::where('email', $request->email)->where('id', '!=', auth('web')->user()->id)->first();
        if ($user) {
            return resReturn(0, '邮箱已被注册', Code::CODE_WRONG);
        }
        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            return resReturn(0, '邮箱格式有误', Code::CODE_WRONG);
        }

        if (!config('mail.username')) {    //没有配置邮箱，直接返回错误
            return resReturn(0, '您的发件邮箱没有配置', Code::CODE_WRONG);
        }
        $redis = new RedisService();
        if ($redis->get('code.register.' . $request->email)) {
            return resReturn(0, '您的验证码还没有失效，请不要重复获取', Code::CODE_WRONG);
        }
        $code = rand(10000, 99999);
        $redis->setex('code.register.' . $request->email, config('dsshop.failuretime'), $code);
        Mail::to($request->email)->send(new VerificationCode($code));
        return resReturn(1, '发送成功');
    }

    /**
     * BindEmailAddress
     * 绑定邮箱
     * @param Request $request
     * @return string
     * @queryParam  email string 邮箱
     * @queryParam  oldEmail string 旧邮箱
     * @queryParam  code int 验证码
     */
    public function verifyEmail(Request $request)
    {
        if (!$request->email) {
            return resReturn(0, '邮箱不能为空', Code::CODE_WRONG);
        }
        if ($request->oldEmail) {
            if (auth('web')->user()->email != $request->oldEmail) {
                return resReturn(0, '请求参数有误', Code::CODE_MISUSE);
            }
            if (auth('web')->user()->email == $request->email) {
                return resReturn(0, '您的邮箱已绑定，无需再次绑定', Code::CODE_WRONG);
            }
        }
        $redis = new RedisService();
        $code = $redis->get('code.register.' . $request->email);
        if (!$code) {
            return resReturn(0, '验证码已失效，请重新获取', Code::CODE_MISUSE);
        }
        if ($code != $request->code) {
            return resReturn(0, '验证码错误', Code::CODE_MISUSE);
        }
        $user = User::where('email', $request->email)->where('id', '!=', auth('web')->user()->id)->first();
        if ($user) {
            return resReturn(0, '邮箱已被注册', Code::CODE_WRONG);
        }
        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            return resReturn(0, '邮箱格式有误', Code::CODE_WRONG);
        }
        $return = DB::transaction(function () use ($request) {
            $User = User::find(auth('web')->user()->id);
            $User->email = $request->email;
            $User->save();
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '绑定成功');
        } else {
            return resReturn(0, '绑定失败', Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * ChangeCellphone
     * 更换手机
     * @param Request $request
     * @return string
     * @queryParam  cellphone string 手机
     * @queryParam  oldCellphone string 旧手机
     * @queryParam  code int 验证码
     */
    public function changeCellphone(Request $request)
    {
        if (!$request->cellphone) {
            return resReturn(0, '手机不能为空', Code::CODE_WRONG);
        }
        if (auth('web')->user()->cellphone == $request->cellphone) {
            return resReturn(0, '您当前手机已绑定，无需再次绑定', Code::CODE_WRONG);
        }
        $redis = new RedisService();
        $code = $redis->get('code.register.' . $request->cellphone);
        if (!$code) {
            return resReturn(0, '验证码已失效，请重新获取', Code::CODE_MISUSE);
        }
        if ($code != $request->code) {
            return resReturn(0, '验证码错误', Code::CODE_MISUSE);
        }
        $user = User::where('cellphone', $request->cellphone)->where('id', '!=', auth('web')->user()->id)->first();
        if ($user) {
            return resReturn(0, '手机号已被注册', Code::CODE_WRONG);
        }
        if (!preg_match('/^1[3456789][0-9]{9}$/', $request->cellphone)) {
            return resReturn(0, '手机格式有误', Code::CODE_WRONG);
        }
        $return = DB::transaction(function () use ($request) {
            $User = User::find(auth('web')->user()->id);
            $User->cellphone = $request->cellphone;
            $User->save();
            return 1;
        }, 5);
        if ($return == 1) {
            return resReturn(1, '绑定成功');
        } else {
            return resReturn(0, '绑定失败', Code::CODE_PARAMETER_WRONG);
        }
    }

    /**
     * GetSMSVerificationCode
     * 获取短信验证码
     * @param $service //短信商标识
     * @param $cellphone //手机号
     * @param $code //验证码
     * @internal param $applySecret
     * @return string
     * @throws \AlibabaCloud\Client\Exception\ClientException
     */
    protected function getCode($service, $cellphone, $code)
    {
        $Aliyun = new Aliyun();
        $return = $Aliyun->sendCode($cellphone, $code);
        (new SmsLog())->setSmsLog(array(
            'sms_service' => $service,
            'phone' => $cellphone,
            'data' => $return
        ));
        return $return;
    }

    /**
     * BalancePay
     * 余额支付
     * @param Request $request
     * @return string
     * @queryParam  id int 订单ID
     */
    public function balancePay(Request $request)
    {
        if (!$request->id) {
            return resReturn(0, '参数有误', Code::CODE_PARAMETER_WRONG);
        }
        $GoodIndent = GoodIndent::with(['goodsList'])->find($request->id);
        $User = User::find(auth('web')->user()->id);
        if ($User->money < $GoodIndent->total) {  //余额小于需要支付的费用
            return resReturn(0, '账户余额不足，无法完成订单', Code::CODE_PARAMETER_WRONG);
        }
        foreach ($GoodIndent->goodsList as $indentCommodity) {
            $Good = Good::select('id', 'is_inventory', 'inventory')->find($indentCommodity['good_id']);
            if ($Good && $Good->is_inventory == Good::GOOD_IS_INVENTORY_FILM) { //付款减库存
                if (!$indentCommodity['good_sku_id']) { //非SKU商品
                    if ($Good->inventory - $indentCommodity['number'] < 0) {
                        return resReturn(0, '存在库存不足的商品，请重新购买', Code::CODE_PARAMETER_WRONG);
                    }
                    $Good->inventory = $Good->inventory - $indentCommodity['number'];
                    $Good->save();
                } else {
                    $GoodSku = GoodSku::find($indentCommodity['good_sku_id']);
                    if ($GoodSku->inventory - $indentCommodity['number'] < 0) {
                        return resReturn(0, '存在库存不足的SKU商品，请重新购买', Code::CODE_PARAMETER_WRONG);
                    }
                    $GoodSku->inventory = $GoodSku->inventory - $indentCommodity['number'];
                    $GoodSku->save();
                }
            }
        }
        $return = DB::transaction(function () use ($request, $GoodIndent) {
            User::where('id', auth('web')->user()->id)->decrement('money', $GoodIndent->total);
            $redis = new RedisService();
            $redis->setex('goodIndent.pay.type.' . $GoodIndent->id, 5, '余额支付');
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_DELIVER;
            $GoodIndent->pay_time = Carbon::now()->toDateTimeString();
            $GoodIndent->save();
            return array(1, '支付成功');
        });
        if ($return[0] == 1) {
            return resReturn(1, $return[1]);
        } else {
            return resReturn(0, $return[0], $return[1]);
        }

    }

    /**
     * UnifiedPayment
     * 统一在线支付
     * @param Request $request
     * @return string
     * @queryParam  type int 支付类型
     */
    public function unifiedPayment(Request $request)
    {
        $PaymentLog = new PaymentLog();
        $PaymentLog->platform = $request->platform;
        $PaymentLog->state = PaymentLog::PAYMENT_LOG_STATE_CREATE;
        $PaymentLog->save();
        return resReturn(1, json_decode($PaymentLog->data, true));
    }
}
