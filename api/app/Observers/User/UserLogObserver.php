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

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function saved(User $user)
    {
        if (strpos($this->request->path(), 'admin') == false) {
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
