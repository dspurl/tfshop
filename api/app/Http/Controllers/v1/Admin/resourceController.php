<?php

namespace App\Http\Controllers\v1\admin;

use App\Code;
use App\Http\Requests\v1\SubmitComponentsRequest;
use App\Http\Requests\v1\SubmitSmsServiceRequest;
use App\Http\Requests\v1\SubmitSmsTemplateRequest;
use App\Models\v1\Brand;
use App\Models\v1\Component;
use App\Models\v1\Resource;
use App\Models\v1\SmsService;
use App\Models\v1\SmsTemplate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class resourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Resource::query();
        $limit=$request->limit;
        $q->orderBy('id','ASC');
        if($request->name){
            $q->where('depict',$request->name);
        }
        $paginate=$q->paginate($limit);
        return resReturn(1,$paginate);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        Resource::where('id',$id)->delete();
        return resReturn(1,'删除成功');
    }
}
