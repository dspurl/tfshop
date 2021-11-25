<?php


namespace App\Observers\User;


use App\Models\v1\User;
use App\Models\v1\UserLog;
use Illuminate\Http\Request;

/**
 * user log
 * 用户日志
 * Class UserLogObserver
 * @package App\Observers\User
 */
class UserLogObserver
{
    protected $request;
    protected $route = [
        'app/login',
        'app/register',
        'app/authorization',
        'app/logout',
        'app/findPassword'
    ];
    protected $execute = false;

    public function __construct(Request $request)
    {
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

    public function saved(User $user)
    {
        if ($this->execute || app()->runningInConsole()) {
            $log = new UserLog();
            $log->user_id = $user->id;
            $log->path = $this->request->path();
            $log->method = $this->request->method();
            $log->ip = $this->request->ip();
            $input = $this->request->except(['rPassword', 'password']);
            $log->input = json_encode($input, JSON_UNESCAPED_UNICODE);
            $log->save();
        }
    }
}
