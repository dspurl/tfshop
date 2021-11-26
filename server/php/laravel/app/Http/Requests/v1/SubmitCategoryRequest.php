<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
use Illuminate\Validation\Rule;

class SubmitCategoryRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        switch ($this->method())
        {
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
                            'string',
                            'max:30',
                        ],
                        'pid' => 'required|numeric',
                        'sort' => 'required|numeric',
                        'state' => 'required|numeric'
                    ];
                } else {
                    return [
                        'name'=> [
                            'required',
                            Rule::unique('categorys')->where(function ($query) use($request) {
                                $query->where('deleted_at', null)->where('pid',$request['pid']);
                            }),
                            'string',
                            'max:30',
                        ],
                        'pid' => 'required|numeric',
                        'sort' => 'required|numeric',
                        'state' => 'required|numeric'
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
            'name.required' =>'类目名称必须',
            'name.string' =>'类目格式有误',
            'name.unique' => '类目名称已存在',
            'name.max' =>'类目不能超过30个字符',
            'pid.required' =>'上级类目必须',
            'pid.numeric' =>'上级类目格式有误',
            'sort.required' =>'排序必须',
            'sort.numeric' =>'排序格式有误',
            'state.required' =>'状态必须',
            'state.numeric' =>'状态格式有误',
        ];
    }
}
