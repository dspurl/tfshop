<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitDistributionRequest extends Request
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
            case 'POST':    //create
                return true;
            case 'PUT': //update
                return true;
            case 'PATCH':
            case 'GET':
            case 'DELETE':
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
        switch ($this->method())
        {
            case 'POST':    //create
                return [
                    'name' => 'required|string|max:30',
                    'identification' => 'required|unique:distributions|string|max:100',
                    'level' => 'required|integer',
                    'distribution_rule'=>'required|array',
                    'distribution_rule.*.name'=>'required|string|max:30',
                    'distribution_rule.*.type'=>'required|integer',
                    'distribution_rule.*.price'=>'required|integer',
                ];
            case 'PUT': //update
                $request = Request::all();
                return [
                    'name' => 'required|string|max:30',
                    'identification' => 'required|unique:distributions,identification,'.$request['id'].'|string|max:100',
                    'level' => 'required|integer',
                    'distribution_rule'=>'required|array',
                    'distribution_rule.*.name'=>'required|string|max:30',
                    'distribution_rule.*.type'=>'required|integer',
                    'distribution_rule.*.price'=>'required|integer',
                ];
            case 'PATCH':
            case 'GET':
            case 'DELETE':
            default:
                {
                    return [];
                }
        }
    }

    public function messages()
    {
        return [
            'name.required' =>'分销名称必须',
            'name.string' =>'分销名称格式有误',
            'name.max' =>'分销名称不能超过30个字符',
            'identification.required' =>'分销标识必须',
            'identification.string' =>'分销标识格式有误',
            'identification.max' =>'分销标识不能超过100个字符',
            'identification.unique' => '分销标识已存在',
            'level.required' =>'分销级别必须',
            'level.integer' =>'分销级别格式有误',
            'distribution_rule.required' =>'分销规则必须',
            'distribution_rule.array' =>'分销规则格式有误',
            'distribution_rule.name.required' =>'分销别名必须',
            'distribution_rule.name.string' =>'分销别名格式有误',
            'distribution_rule.name.max' =>'分销别名不能超过30个字符',
            'distribution_rule.type.required' =>'返佣方式必须',
            'distribution_rule.type.integer' =>'返佣方式格式有误',
            'distribution_rule.price.required' =>'返佣值必须',
            'distribution_rule.price.number' =>'返佣值格式有误',
        ];
    }
}
