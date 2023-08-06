<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
use Illuminate\Validation\Rule;
class SubmitBrandRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        switch ($this->method()) {
            case 'POST':
                return true;
            case 'GET':
            default:
            {
                return false;
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $request = Request::all();
        switch ($this->method()) {
            case 'POST':    //create
                if (Request::has('id')) {   //更新
                    return [
                        'name'=> [
                            'required',
                            Rule::unique('brands')->where(function ($query) use($request) {
                                $query->where('deleted_at', null)->where('id','!=',$request['id']);
                            }),
                            'string',
                            'max:30',
                        ],
                        'logo' => 'nullable|string',
                        'sort' => 'required|numeric|max:6'
                    ];
                } else {
                    return [
                        'name'=> [
                            'required',
                            Rule::unique('brands')->where(function ($query) {
                                $query->where('deleted_at', null);
                            }),
                            'string',
                            'max:30',
                        ],
                        'logo' => 'nullable|string',
                        'sort' => 'required|numeric|max:6'
                    ];
                }
            case 'GET':
            default:
            {
                return [];
            }
        }
    }

    public function messages()
    {

        return [
            'name.required' => __('hint.error.not_null', ['attribute' => __('brand.name')]),
            'name.string' => __('hint.error.wrong_format', ['attribute' => __('brand.name')]),
            'name.unique' => __('hint.error.exist', ['attribute' => __('brand.name')]),
            'name.max' => __('hint.error.max', ['attribute' => __('brand.name'), 'place' => 30]),
            'sort.required' => __('hint.error.not_null', ['attribute' => __('common.sort')]),
            'sort.numeric' => __('hint.error.wrong_format', ['attribute' => __('common.sort')]),
        ];
    }
}
