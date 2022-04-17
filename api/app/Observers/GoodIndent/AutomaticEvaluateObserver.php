<?php
namespace App\Observers\GoodIndent;
use App\Models\v1\Comment;
use Illuminate\Http\Request;
use App\Models\v1\GoodIndent;
/**
 * automatic evaluate
 * 自动评价处理
 * Class AutomaticEvaluateObserver
 * @package App\Observers\GoodIndent
 */
class AutomaticEvaluateObserver
{
    protected $request;
    protected $route = [
        // 这里配置需要执行该观察者的路由
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
    public function updated(GoodIndent $goodIndent)
    {
        if(app()->runningInConsole() && $goodIndent->state == GoodIndent::GOOD_INDENT_STATE_HAVE_EVALUATION){
            foreach ($goodIndent->goodsList as $id=>$goodsList){
                $Comment = new Comment();
                $Comment->user_id = 0;
                $Comment->model_id = $goodsList['id'];
                $Comment->score = 5;
                $Comment->model_type = 'App\Models\v'.config('dswjcms.versions').'\GoodIndentCommodity';
                $Comment->details = '系统默认好评';
                $Comment->state = Comment::COMMENT_STATE_PASS;
                $Comment->anonymity = Comment::COMMENT_ANONYMITY_NO;
                $Comment->save();
            }
        }
    }
}
