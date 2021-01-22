<?php

namespace App\Http\Controllers\v1\Admin;

use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ResourceController extends Controller
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
        $q->orderBy('id','DESC');
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
