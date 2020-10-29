<?php

namespace App\Http\Controllers\v1\Element;

use App\Code;
use App\Http\Requests\v1\SubmitBannerRequest;
use App\Models\v1\Common;
use App\Models\v1\Banner;
use App\Models\v1\Category;
use App\Models\v1\Resource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CategoryAppController extends Controller
{
    /**
     * get top category for wx
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $q = Category::query();
        $q->with(['resources' => function ($q) {
            $q->select('img', 'image_id');
        }]);
        $result = $q->where([['pid', '=', 0], ['state', '=', 0]])->orderBy('sort', 'ASC')->select('id', 'name', 'pid')->get();
        return resReturn(1, $result);
    }
}
