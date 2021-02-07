<?php

namespace App\Http\Controllers\v1\Admin;

use App\Code;
use App\Http\Requests\v1\SubmitAdminRequest;
use App\Models\v1\Admin;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

/**
 * @group admin
 * 管理员管理
 * Class AdminController
 * @package App\Http\Controllers\v1\Admin
 */
class AdminController extends Controller
{
    /**
     * AdminList
     * 管理员列表
     * @param Request $request
     * @queryParam  title string 管理员账号
     * @queryParam  limit int 每页显示条数
     * @queryParam  sort string 排序
     * @queryParam  page string 页码
     * @return string
     */
    public function list(Request $request)
    {
        $q = Admin::query();
        $limit = $request->limit;
        if ($request->has('sort')) {
            $sortFormatConversion = sortFormatConversion($request->sort);
            $q->orderBy($sortFormatConversion[0], $sortFormatConversion[1]);
        }
        $q->queryTitle($request->title);
        $paginate = $q->with('AuthGroup')->paginate($limit);
        Admin::role($paginate);
        return resReturn(1, $paginate);
    }

    /**
     * AdminCreate
     * 创建管理员
     * @param SubmitAdminRequest $request
     * @queryParam  name string 管理员账号
     * @queryParam  email string 邮箱地址
     * @queryParam  cellphone int 手机号
     * @queryParam  portrait string 头像地址
     * @queryParam  password string 密码
     * @return string
     */
    public function create(SubmitAdminRequest $request)
    {
        $Admin = new Admin;
        $Admin->name = $request->name;
        $Admin->email = $request->email;
        $Admin->cellphone = $request->cellphone;
        $Admin->portrait = imgPathShift('portrait', $request->portrait);
        $Admin->last_login_at = Carbon::now()->toDateTimeString();
        $Admin->password = bcrypt($request->password);
        $Admin->save();
        return resReturn(1, '添加成功');

    }

    /**
     * AdminEdit
     * 保存管理员/密码
     * @param $id
     * @param SubmitAdminRequest $request
     * @queryParam  id int 管理员ID
     * @queryParam  name string 管理员账号
     * @queryParam  email string 邮箱地址
     * @queryParam  cellphone int 手机号
     * @queryParam  portrait string 头像地址
     * @queryParam  password string 密码
     * @return string
     */
    public function edit($id,SubmitAdminRequest $request)
    {
        $Admin = Admin::find($id);
        if ($request->password) {  //修改密码
            $Admin->password = bcrypt($request->password);
        }
        $Admin->name = $request->name;
        $Admin->cellphone = $request->cellphone;
        $Admin->email = $request->email;
        $Admin->portrait = imgPathShift('portrait', $request->portrait);
        $Admin->save();
        return resReturn(1, '修改成功');
    }

    /**
     * AdminDestroy
     * 删除管理员
     * @param $id
     * @queryParam  id int 管理员ID
     * @return string
     */
    public function destroy($id)
    {
        if (!$id) {
            return resReturn(0, '参数错误', Code::CODE_PARAMETER_WRONG);
        }
        $Admin = Admin::find($id);
        Storage::delete('public/image/avatar/' . $Admin->portrait);    //删除头像
        $Admin->delete();
        return resReturn(1, '删除成功');
    }
}
