<?php
namespace App\Observers\User;
use App\Models\v1\Integral;
use Illuminate\Http\Request;
use App\Models\v1\User;
/**
 * create Integral
 * 创建用户生成积分
 * Class CreateIntegralObserver
 * @package App\Observers\User
 */
class CreateIntegralObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
        'app/authorization',
        'app/register',
        'app/member',
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
                // 如果路由带参数，请用以下代码
//                $name = 'admin' . preg_replace("/\/\\d+/", '', $path[1]);
            } else {
                $path = explode("app", $request->path());
                $name = 'app' . $path[1];
                // 如果路由带参数，请用以下代码
//                $name = 'app' . preg_replace("/\/\\d+/", '', $path[1]);
            }
            if (collect($this->route)->contains($name)) {
                $this->execute = true;
            }
        }
    }
    public function created(User $user)
    {
        // 只有配置的路由存在于$route或通过console执行时才会触发,console执行时需要自行添加唯一条件
        if (($this->execute || app()->runningInConsole())) {
            // 需要执行的业务代码
            $Integral = new Integral();
            $Integral->user_id = $user->id;
            $Integral->save();
        }
    }
}
