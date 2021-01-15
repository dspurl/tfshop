<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitAdminRequest;
use App\Http\Requests\v1\SubmitAuthGroupRequest;
use App\Http\Requests\v1\SubmitAuthRuleRequest;
use App\Http\Requests\v1\SubmitUserRequest;
use App\Models\v1\Admin;
use App\Models\v1\AuthGroup;
use App\Models\v1\AuthGroupAuthRule;
use App\Models\v1\AuthRule;
use App\Models\v1\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    //管理员列表
    public function index(Request $request){
        $q = Admin::query();
        $limit=$request->limit;
        $q->orderBy('id','ASC');
        $q->queryTitle($request->title);
        $paginate=$q->with('authGroup')->paginate($limit);
        Admin::role($paginate);
        return resReturn(1,$paginate);
    }

    //添加管理员
    public function createAdmin(SubmitAdminRequest $request){
        DB::transaction(function ()use($request){
            $Admin = new Admin;
            $Admin->name=$request->name;
            $Admin->email=$request->email;
            $Admin->cellphone=$request->cellphone;
            $Admin->portrait=imgPathShift('portrait',$request->portrait);
            $Admin->time=Carbon::now()->toDateTimeString();
            $Admin->last_login_at=Carbon::now()->toDateTimeString();
            $Admin->password=bcrypt($request->password);
            $Admin->save();
        }, 5);
        return resReturn(1,'添加成功');

    }

    //修改管理员/密码
    public function updataAdmin(SubmitAdminRequest $request){
        $Admin = Admin::find($request->id);
        if($request->password){  //修改密码
            $Admin->password = bcrypt($request->password);
        }
        $Admin->name=$request->name;
        $Admin->cellphone=$request->cellphone;
        $Admin->email=$request->email;
        $Admin->portrait=imgPathShift('portrait',$request->portrait);
        $Admin->save();
        return resReturn(1,'修改成功');
    }

    //删除管理员
    public function destroyAdmin($id){
        if(!$id){
            return resReturn(0,'参数错误',Code::CODE_PARAMETER_WRONG);
        }
        $user = Admin::find($id);
        Storage::delete('public/image/avatar/'.$user->portrait);    //删除头像
        $user->delete();
        return resReturn(1,'删除成功');
    }

    //用户列表
    public function user(Request $request){
        User::$withoutAppends = false;
        $q = User::query();
        $page=$request->page;
        $limit=$request->limit;
        $sort=$request->sort;
        switch($sort){
            case '+id':
                $q->orderBy('id','DESC');
                break;
            case '-id':
                $q->orderBy('id','ASC');
                break;
            case '+time':
                $q->orderBy('last_login_date','DESC');
                break;
            case '-time':
                $q->orderBy('last_login_date','ASC');
                break;
        }
        if($request->title){
            $q->where('id',$request->title)->orWhere('cellphone',$request->title)->orWhere('name','like','%'.$request->title.'%');
        }
        if($request->timeInterval){
            $timeInterval=explode("至",$request->timeInterval);
            $timeInterval[0]=$timeInterval[0].' 00:00:00';
            $timeInterval[1]=$timeInterval[1].' 23:59:59';
            $q->where('insert_date','>=',$timeInterval[0]);
            $q->where('insert_date','<=',$timeInterval[1]);
        }
        $paginate = $q->paginate($limit)->toArray();
        return resReturn(1,$paginate);
    }

    /**
     * 添加用户
     * @param SubmitUserRequest $request
     * @return string
     */
    public function createUser(SubmitUserRequest $request){
        DB::transaction(function ()use($request){
            $User = new User();
            $User->name=$request->name;
            $User->cellphone=$request->cellphone;
            $User->nickname=$request->nickname;
            $User->state=$request->state;
            $User->gender=$request->gender;
            $User->password=bcrypt($request->password);
            $User->save();
        }, 5);
        return resReturn(1,'添加成功');

    }

    /**
     * 用户修改
     * @param SubmitUserRequest $request
     * @return string
     */
    public function updataUser(SubmitUserRequest $request){
        $User = User::find($request->id);
        if($request->password){  //修改密码
            $User->password = bcrypt($request->password);
        }
        $User->name=$request->name;
        $User->state=$request->state;
        $User->cellphone=$request->cellphone;
        $User->nickname=$request->nickname;
        $User->gender=$request->gender;
        $User->save();
        return resReturn(1,'修改成功');
    }

    //管理组列表
    public function manage(Request $request){
        $q = Admin::query();
        //查询管理员列表
        $group = $q->where('state',Admin::ADMIN_STATA_NORMAL)->get(['id','name']);
        $options=[];
        if($group){
            foreach ($group as $g){
                $options[]=array(
                    'value'=>$g->id,
                    'label'=>$g->name
                );
            }
        }
        //查询API列表
        $auth_rule=AuthRule::orderBy('pid','asc')->orderBy('sort','asc')->orderBy('id')->get(['id','title','pid']);
        if($auth_rule){
            $auth_ruleArray=[];
            foreach($auth_rule as $a){
                $rule[$a->id]=$a->title;
                $auth_ruleArray[$a->id]=array(
                    'label'=>$a->title,
                    'value'=>$a->id,
                    'pid'=>$a->pid,
                    'id'=>$a->id
                );
                $fromData[]=array(
                    'label'=>$a->title,
                    'value'=>$a->id,
                    'pid'=>$a->pid,
                    'id'=>$a->id
                );
            }
        }
        //查询管理组列表

        $auth_groups=AuthGroup::with(['Admins'=>function($query){
            $query->select('id','name');
        },'AuthRule'=>function($query){
            $query->select('id','title','pid');
        }])->orderBy('id')->get(['id','roles','introduction'])->toArray();
        foreach($auth_groups as $id=>$a){
            $toData=[];
            $pidData=[];
            $a['rules']=[];
            foreach($a['admins'] as $groupname){
                $auth_groups[$id]['groupname'][]=$groupname['name'];
                $auth_groups[$id]['group'][]=$groupname['id'];
                $auth_groups[$id]['oldGroupValue'][]=$groupname['id'];
                $auth_groups[$id]['oldGroup'][]=array(
                    'label'=>$groupname['name'],
                    'value'=>$groupname['id']
                );
            }
            foreach($a['auth_rule'] as $rules){
                $auth_groups[$id]['rules'][]=$a['rules'][]=$rules['id'];
                $auth_groups[$id]['power'][]=$rule[$rules['id']];
                //获取已选中数组
                $toData[$rules['id']]=$auth_ruleArray[$rules['id']];
            }

            //获取未选中的内容
            $fromDatas=[];
            foreach ($fromData as $s =>$f){
                if(!in_array($f['id'],$a['rules']) || !in_array($f['pid'],$a['rules'])){
                    $fromDatas[]=$f;
                }
            }
            $auth_groups[$id]['fromData']=unsetMultiKeys(array('value'),genTree($fromDatas,'pid'));

            if($auth_groups[$id]['fromData']){
                foreach($auth_groups[$id]['fromData'] as $s =>$f ){

                    if(!array_key_exists('children',$f)){
                        unset($auth_groups[$id]['fromData'][$s]);
                    }
                }
                $auth_groups[$id]['fromData']=array_values($auth_groups[$id]['fromData']);
            }

            $auth_groups[$id]['toData']=unsetMultiKeys(array('value'),genTree($toData,'pid'));

            unset($auth_groups[$id]['users']);
        }
        $data['data']=$auth_groups;
        $data['options']=$options;
        $fromData=genTree($fromData,'pid');
        $fromData=unsetMultiKeys(array('value'),$fromData);
        $data['fromData']=$fromData;
        return resReturn(1,$data);
    }

    //添加管理组
    public function createManage(SubmitAuthGroupRequest $request){
        DB::transaction(function ()use($request){
            $authGroup = new AuthGroup;
            $authGroup->roles=$request->roles;
            $authGroup->introduction=$request->introduction;
            $rules=$authGroup->returnRulesData($request->rules);
            $authGroup->save();
            //关联表操作

            if(count($rules)>0){
                foreach ($rules as $id => $r){
                    $data[]=array(
                        'auth_rule_id'=>$r,
                        'auth_group_id'=>$authGroup->id,
                    );
                }
                DB::table('auth_group_auth_rules')->insert($data);
                unset($data);
            }
            if(count($request->group)>0){
                foreach ($request->group as $id => $group){
                    $data[]=array(
                        'admin_id'=>$group,
                        'auth_group_id'=>$authGroup->id,
                    );
                }
                DB::table('admin_auth_group')->insert($data);
                unset($data);
            }

        }, 5);
        return resReturn(1,'添加成功');
    }

    //修改管理组
    public function updataManage(SubmitAuthGroupRequest $request){
        $authGroup = AuthGroup::find($request->id);
        DB::transaction(function ()use($request,$authGroup){
            $authGroup->roles=$request->roles;
            $authGroup->introduction=$request->introduction;
            $rules=[];

            if(!is_numeric($request->rules[0])){
                $rules=$authGroup->returnRulesData($request->rules);
            }else{
                $rules=$request->rules;
            }

            $authGroup->save();
            //修改中间表
            DB::table('auth_group_auth_rules')->where('auth_group_id',$authGroup->id)->delete();
            if($rules){
                foreach ($rules as $id => $r){
                    $data[]=array(
                        'auth_rule_id'=>$r,
                        'auth_group_id'=>$authGroup->id,
                    );
                }
                DB::table('auth_group_auth_rules')->insert($data);
                unset($data);
            }

            DB::table('admin_auth_group')->where('auth_group_id',$authGroup->id)->delete();
            if($request->group){
                foreach ($request->group as $id => $group){
                    $data[]=array(
                        'admin_id'=>$group,
                        'auth_group_id'=>$authGroup->id,
                    );
                }
                DB::table('admin_auth_group')->insert($data);
                unset($data);
            }
        }, 5);
        return resReturn(1,'修改成功');
    }

    //删除管理组
    public function destroyManage($id){
        DB::transaction(function ()use($id){
            if(!$id){
                return resReturn(0,'参数错误',Code::CODE_PARAMETER_WRONG);
            }
            $authGroup = AuthGroup::find($id);
            $authGroup->delete();
            DB::table('auth_group_auth_rules')->where('auth_group_id',$authGroup->id)->delete();
            DB::table('admin_auth_group')->where('auth_group_id',$authGroup->id)->delete();
        }, 5);
        return resReturn(1,'删除成功');
    }

    //权限管理
    public function power(Request $request){
        $q = AuthRule::query();
        $page=$request->page;
        $limit=$request->limit;
        $sort=$request->sort;
        $q->orderBy('pid','asc');
        $q->orderBy('sort','asc');
        $q->orderBy('id','asc');
        if($request->title){
            $q->where('id',$request->title)->orWhere('title','like','%'.$request->title.'%')->orWhere('api','like','%'.$request->title.'%');
        }
        if(isset($request->pid)){
            $q->where('pid',collect($request->pid)->last());
        }
        $paginate = $q->paginate($limit)->toArray();
        $array=AuthRule::with(['AuthGroup'])->get()->toArray();
        if($array){
            foreach($array as $id =>$a){
                $grouping[$a['id']] = $a['title'];
                $options[]=array(
                    'value'=>$a['id'],
                    'label'=>$a['title'],
                    'pid'=>$a['pid'],
                    'id'=>$a['id']
                );
            }
        }
        foreach($paginate['data'] as $id =>$d){
            $paginate['data'][$id]['pid']=getParentClassHierarchy($d['pid'],$options);
            if(count($paginate['data'][$id]['pid'])<1){
                $paginate['data'][$id]['pid'] = [0];
            }
        }

        $paginate['options'] = collect(genTree($options,'pid'))->prepend(array(
            'value'=>0,
            'label'=>'顶级分组'
        ));
        return resReturn(1,$paginate);
    }

    //添加权限
    public function createPower(SubmitAuthRuleRequest $request){
        $authRule = new AuthRule;
        $authRule->title=$request->title;
        $authRule->url=$request->url ? $request->url : '';
        $authRule->icon=$request->icon ? $request->icon : '';
        $authRule->sort=$request->sort ? $request->sort : 0;
        $authRule->api=$request->api;
        $pid = collect($request->pid)->last();
        $authRule->pid=$pid>0 ? $pid :0;
        $authRule->state=$request->state;
        $authRule->save();
        return resReturn(1,'添加成功');
    }

    //修改权限
    public function updataPower(SubmitAuthRuleRequest $request){
        $authRule = AuthRule::find($request->id);
        $authRule->title=$request->title;
        $authRule->api=$request->api;
        $pid = collect($request->pid)->last();
        $authRule->pid=$pid>0 ? $pid :0;
        $authRule->url=$request->url ? $request->url : '';
        $authRule->icon=$request->icon ? $request->icon : '';
        $authRule->sort=$request->sort ? $request->sort : 0;
        $authRule->state=$request->state;
        $authRule->save();
        return resReturn(1,'修改成功');
    }

    //删除权限
    public function destroyPower($id){
        DB::transaction(function ()use($id){
            if(!$id){
                return resReturn(0,'参数错误',Code::CODE_PARAMETER_WRONG);
            }
            $authRule = AuthRule::find($id);
            $authRule->delete();
            AuthGroupAuthRule::where('auth_rule_id',$id)->delete();
        }, 5);
        return resReturn(1,'删除成功');
    }
}
