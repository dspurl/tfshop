<?php

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
            'name.required' => '品牌名称必须',
            'name.string' => '品牌名称格式有误',
            'name.unique' => '品牌名称已存在',
            'name.max' => '品牌名称不能超过30个字符',
            'sort.required' => '排序必须',
            'sort.numeric' => '排序格式有误',
            'sort.max' => '排序不能超过6个字符',
        ];
    }
}
