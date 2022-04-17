<?php
namespace App\Observers\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
/**
 * order rate notification
 * 订单评价通知
 * Class OrderRateNotificationObserver
 * @package App\Observers\GoodIndent
 */
class OrderRateNotificationObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/goodIndent/receipt',
    ];
    protected $execute = false;
    public function __construct(Request $request)
    {
        // 是否执行观察者，默认为不执行，只有路由存在于$route时才会触发,并且在非http请求时不会触发
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . preg_replace("/\/\\d+/", '', $path[1]);
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . preg_replace("/\/\\d+/", '', $path[1]);
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }
    public function updated(GoodIndent $goodIndent)
    {
        // 当状态为已完成时触发
        if (($this->execute || app()->runningInConsole()) && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_ACCOMPLISH) {
            $parameter = [
                'id' => $goodIndent->id,  //订单ID
                'identification' => $goodIndent->identification,  //订单号
                'confirm_time' => $goodIndent->confirm_time,    //确认收货时间
                'template' => 'order_evaluate',   //通知模板标识
                'user_id' => $goodIndent->User->id    //用户ID
            ];
            $goodIndent = GoodIndent::find($goodIndent->id);
            $goodIndent->state = GoodIndent::GOOD_INDENT_STATE_EVALUATE;
            if (config('comment.automaticEvaluateState')) {
                $automaticEvaluate = config('comment.automaticEvaluate');
                $goodIndent->evaluate_time = date('Y-m-d H:i:s', strtotime("+$automaticEvaluate day"));
            }
            $goodIndent->save();
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => '待评价提醒',
                'list' => [
                    [
                        'keyword' => '订单编号',
                        'data' => $parameter['identification']
                    ],
                    [
                        'keyword' => '完成时间',
                        'data' => $parameter['confirm_time']
                    ]
                ],
                'remark' => '点击详情,您可以对订单进行评价',
                'url' => '/pages/order/score?id=' . $parameter['id'],
                'parameter' => $parameter,
                'prefers' => ['database', 'wechat', 'mail']
            ];
            $user = User::find($parameter['user_id']);
            $user->notify(new InvoicePaid($invoice));
        }
    }
}
