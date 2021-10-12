<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitFreightRequest extends Request
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
                        'name' => 'required|unique:freights,name,' . $request['id'] . '|string|max:60',
                        'location' => 'required|array',
                        'pinkage' => 'nullable|array',
                        'valuation' => 'required|integer',
                        'freight_way'=> 'nullable|array',
                        'freight_way.*.add_cost'=> 'required|numeric',
                        'freight_way.*.add_piece'=> 'required|numeric',
                        'freight_way.*.first_cost'=> 'required|numeric',
                        'freight_way.*.first_piece'=> 'required|numeric',
                        'freight_way.*.location'=> 'required|array',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:freights|string|max:60',
                        'location' => 'required|array',
                        'pinkage' => 'nullable|array',
                        'valuation' => 'required|integer',
                        'freight_way'=> 'nullable|array',
                        'freight_way.*.add_cost'=> 'required|numeric',
                        'freight_way.*.add_piece'=> 'required|numeric',
                        'freight_way.*.first_cost'=> 'required|numeric',
                        'freight_way.*.first_piece'=> 'required|numeric',
                        'freight_way.*.location'=> 'required|array',
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
            'name.required' =>'模板名称必须',
            'name.string' =>'模板名称格式有误',
            'name.unique' =>'模板名称已存在',
            'name.max' =>'模板名称不能超过60个字符',
            'location.required' =>'宝贝地址必须',
            'location.array' =>'宝贝地址必须是数组',
            'pinkage.array' =>'包邮地址必须是数组',
            'valuation.required' =>'计价方式必须',
            'valuation.integer' =>'计价方式格式有误',
            'freight_way.array' =>'不包邮配送区域必须是数组',
            'freight_way.*.first_piece.required' =>'首件必须',
            'freight_way.*.first_piece.integer' =>'首件格式有误',
            'freight_way.*.first_cost.required' =>'首费必须',
            'freight_way.*.first_cost.numeric' =>'首费格式有误',
            'freight_way.*.add_piece.required' =>'续件必须',
            'freight_way.*.add_piece.integer' =>'续件格式有误',
            'freight_way.*.add_cost.required' =>'续费必须',
            'freight_way.*.add_cost.numeric' =>'续费格式有误',
            'freight_way.*.location.required' =>'送货到必须',
            'freight_way.location.array' =>'送货到必须是数组',
        ];
    }
}
