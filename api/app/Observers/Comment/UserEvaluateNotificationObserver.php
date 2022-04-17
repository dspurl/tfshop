<?php

namespace App\Observers\Comment;

use App\Models\v1\GoodIndent;
use App\Models\v1\User;
use App\Notifications\InvoicePaid;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\v1\Comment;

/**
 * user evaluate notification
 * 用户完成评价通知
 * Class UserEvaluateNotificationObserver
 * @package App\Observers\Comment
 */
class UserEvaluateNotificationObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/comment',
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

    public function created(Comment $comment)
    {
        if ($this->execute) {
            $comment = Comment::with(['User', 'GoodIndentCommodity'])->find($comment->id);
            $GoodIndent = GoodIndent::find($comment->GoodIndentCommodity->good_indent_id);
            $GoodIndent->state = GoodIndent::GOOD_INDENT_STATE_HAVE_EVALUATION;
            $GoodIndent->evaluate_time = Carbon::now()->toDateTimeString();
            $GoodIndent->save();
            $parameter = [
                'id' => $comment->id,  //评价ID
                'cellphone' => $comment->User->cellphone,  //评价人
                'details' => $comment->details,    //评价内容
                'template' => 'admin_order_evaluate',   //通知模板标识
                'time' => $comment->created_at    //评价时间
            ];
            $invoice = [
                'type' => InvoicePaid::NOTIFICATION_TYPE_SYSTEM_MESSAGES,
                'title' => '收到新的评价消息',
                'list' => [
                    [
                        'keyword' => '评价人',
                        'data' => $parameter['cellphone']
                    ],
                    [
                        'keyword' => '评价内容',
                        'data' => $parameter['details']
                    ],
                    [
                        'keyword' => '评价时间',
                        'data' => $parameter['time']
                    ]
                ],
                'remark' => '点击查看详细信息',
                'url' => '/tool/comment/commentList?model_id=' . $parameter['id'],
                'parameter' => $parameter,
                'admin' => true,
                'prefers' => ['wechat', 'mail']
            ];
            if (config('notification.account')) {
                $account = explode(',', config('notification.account'));
                foreach ($account as $uid) {
                    $user = User::find($uid);
                    if ($user) {
                        $invoice['parameter']['user_id'] = $uid;
                        $user->notify(new InvoicePaid($invoice)); // 发送通知
                    }
                }
            }
        }
    }
}
