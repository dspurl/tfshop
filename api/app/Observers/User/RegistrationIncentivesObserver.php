<?php

namespace App\Observers\User;

use App\Code;
use App\Models\v1\Distribution;
use App\Models\v1\DistributionLog;
use App\Models\v1\DistributionRule;
use App\Models\v1\MoneyLog;
use App\Models\v1\UserRelation;
use App\Notifications\InvoicePaid;
use Illuminate\Http\Request;
use App\Models\v1\User;

/**
 * registration incentives
 * 注册一级分销奖励
 * Class RegistrationIncentivesObserver
 * @package App\Observers\User
 */
class RegistrationIncentivesObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/register',
        'app/authorization',
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
        // 是否执行观察者，默认为不执行，只有路由存在于$route时才会触发,并且在非http请求时不会触发
        if (!app()->runningInConsole()) {
            $this->request = $request;
            $path = explode("admin", $request->path());
            if (count($path) == 2) {
                $name = 'admin' . $path[1];
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . $path[1];
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }

    /**
     * @param User $user
     * @throws \Exception
     */
    public function created(User $user)
    {
        if ($this->execute || app()->runningInConsole()) {
            // 用户关系绑定
            if ($this->request->has('uuid')) {
                // 注册奖励规则获取
                $Distribution = Distribution::where('state', Distribution::DISTRIBUTION_STATE_OPEN)->where('identification', Distribution::DISTRIBUTION_IDENTIFICATION_REGISTRATION__CASH)
                    ->with(['DistributionRule'])->first();
                $UserParent = User::where('uuid', $this->request->uuid)->with([ //一级
                    'UserRelation' => function ($q) {   //二级
                        $q->where('level', UserRelation::USER_RELATION_LEVEL_ONE_LEVEL)->with(['UserRelation' => function ($q) {   //三级
                            $q->where('level', UserRelation::USER_RELATION_LEVEL_ONE_LEVEL);
                        }]);
                    }
                ])->first();
                if ($Distribution) {
                    try {    // 防止未按后台录入格式入库的脏数据产生的异常
                        if ($Distribution->DistributionRule[0]->type == DistributionRule::DISTRIBUTION_RULE_TYPE_FIXED_VALUE) {
                            $price = $Distribution->DistributionRule[0]->price;
                        } else {
                            $price = 0;   //注册奖励没有参考金额，所以无法按比例奖励，如需按比例，请写死一个固定值
                        }
                    } catch (\EXception $e) {
                        throw new \Exception('后台分销配置有误', Code::CODE_WRONG);
                    }
                    // 注册奖励处理
                    if ($Distribution) {
                        User::where('id', $UserParent->id)->increment('money', $price);
                        $DistributionLog = new DistributionLog();
                        $DistributionLog->user_id = $UserParent->id;
                        $DistributionLog->children_id = $user->id;
                        $DistributionLog->name = $Distribution->name;
                        $DistributionLog->type = $Distribution->DistributionRule[0]->type;
                        $DistributionLog->level = DistributionLog::DISTRIBUTION_LOG_LEVEL_ONE_LEVEL;
                        $DistributionLog->price = $price;
                        $DistributionLog->save();
                        $Money = new MoneyLog();
                        $Money->user_id = $UserParent->id;
                        $Money->type = MoneyLog::MONEY_LOG_TYPE_INCOME;
                        $Money->money = $price;
                        $Money->remark = '邀请奖励，获得' . ($price / 100) . '元';
                        $Money->save();
                        $parameter = [
                            'money_id' => $Money->id,  //资金记录ID
                            'total' => $price,    //奖励金额
                            'user_id' => $UserParent->id   //用户ID
                        ];
                        $invoice = [
                            'type' => InvoicePaid::NOTIFICATION_TYPE_DEAL,
                            'title' => '邀请奖励',
                            'list' => [
                                [
                                    'keyword' => '支付方式',
                                    'data' => '余额支付'
                                ]
                            ],
                            'price' => $parameter['total'],
                            'url' => '/pages/finance/bill_show?id=' . $parameter['money_id'],
                            'remark' => '邀请奖励，获得' . ($parameter['total'] / 100) . '元',
                            'prefers' => ['database']
                        ];
                        $notifyUser = User::find($parameter['user_id']);
                        $notifyUser->notify(new InvoicePaid($invoice));
                    }
                }
                // 一级关系绑定
                $UserRelation = new UserRelation();
                $UserRelation->children_id = $user->id;    //注册用户ID
                $UserRelation->parent_id = $UserParent->id;    //一级ID
                $UserRelation->level = UserRelation::USER_RELATION_LEVEL_ONE_LEVEL;
                $UserRelation->save();
                //二级关系绑定
                if ($UserParent->UserRelation) {
                    $UserRelation = new UserRelation();
                    $UserRelation->children_id = $user->id;  //注册用户ID
                    $UserRelation->parent_id = $UserParent->UserRelation->parent_id;  //二级ID
                    $UserRelation->level = UserRelation::USER_RELATION_LEVEL_SECOND_LEVEL;
                    $UserRelation->save();
                    //三级关系绑定
                    if ($UserParent->UserRelation->UserRelation) {
                        $UserRelation = new UserRelation();
                        $UserRelation->children_id = $user->id;  //注册用户ID
                        $UserRelation->parent_id = $UserParent->UserRelation->UserRelation->parent_id;  //三级ID
                        $UserRelation->level = UserRelation::USER_RELATION_LEVEL_THREE_LEVEL;
                        $UserRelation->save();
                    }
                }
            }
        }
    }
}
