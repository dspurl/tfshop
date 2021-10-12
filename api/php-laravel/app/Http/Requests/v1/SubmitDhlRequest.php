<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
use Illuminate\Validation\Rule;

class SubmitDhlRequest extends Request
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
                            Rule::unique('dhls')->where(function ($query) use($request) {
                                $query->where('deleted_at', null)->where('id','!=',$request['id']);
                            }),
                            'string',
                            'max:30',
                        ],
                        'abbreviation' => 'required|string|max:80',
                        'sort' => 'required|integer',
                        'state' => 'required|integer',
                    ];
                } else {
                    return [
                        'name'=> [
                            'required',
                            Rule::unique('dhls')->where(function ($query) {
                                $query->where('deleted_at', null);
                            }),
                            'string',
                            'max:30',
                        ],
                        'abbreviation' => 'required|string|max:80',
                        'sort' => 'required|integer',
                        'state' => 'required|integer',
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
            'name.required' =>'快递公司名称必须',
            'name.string' =>'快递公司名称格式有误',
            'name.unique' => '快递公司名称已存在',
            'name.max' =>'快递公司名称不能超过30个字符',
            'abbreviation.required' =>'快递公司缩写必须',
            'abbreviation.string' =>'快递公司缩写格式有误',
            'abbreviation.max' =>'快递公司缩写不能超过80个字符',
            'state.required' =>'状态必须',
            'state.integer' =>'状态格式有误',
            'sort.required' =>'排序必须',
            'sort.integer' =>'排序格式有误',
        ];
    }
}
