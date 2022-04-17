<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitIntegralDrawRequest extends Request
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
                        'name' => 'required|unique:integral_draws,name,' . $request['id'] . '|string|max:20',
                        'type' => 'required|integer',
                        'time' => 'required|array',
                        'integral' => 'required|integer',
                        'tries' => 'nullable|integer',
                        'integral_prize' => 'required|array',
                        'integral_prize.*.model_id' => 'required|integer',
                        'integral_prize.*.model_type' => 'nullable|string|max:200',
                        'integral_prize.*.name' => 'required|string|max:60',
                        'integral_prize.*.value' => 'required|numeric',
                        'integral_prize.*.recycle' => 'nullable|integer',
                        'integral_prize.*.quantity' => 'required|integer',
                        'integral_prize.*.residue' => 'required|integer',
                        'integral_prize.*.probability' => 'required|integer',
                        'integral_prize.*.sort' => 'required|integer',
                        'integral_prize.*.is_hidden' => 'required|integer',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:admins|string|max:20',
                        'type' => 'required|integer',
                        'time' => 'required|array',
                        'integral' => 'required|integer',
                        'tries' => 'nullable|integer',
                        'integral_prize' => 'required|array',
                        'integral_prize.*.model_id' => 'required|integer',
                        'integral_prize.*.model_type' => 'nullable|string|max:200',
                        'integral_prize.*.name' => 'required|string|max:60',
                        'integral_prize.*.value' => 'required|numeric',
                        'integral_prize.*.recycle' => 'nullable|integer',
                        'integral_prize.*.quantity' => 'required|integer',
                        'integral_prize.*.probability' => 'required|integer',
                        'integral_prize.*.sort' => 'required|integer',
                        'integral_prize.*.is_hidden' => 'required|integer',
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
            'name.required' => '名称必须',
            'name.string' => '名称格式有误',
            'name.unique' => '名称已存在',
            'type.required' => '抽奖类型必须',
            'type.integer' => '抽奖类型格式有误',
            'time.required' => '有效时间必须',
            'time.array' => '有效时间格式有误',
            'integral.required' => '所需积分必须',
            'integral.integer' => '所需积分格式有误',
            'tries.integer' => '限制次数格式有误',
            'integral_prize.required' => '奖品名称必须',
            'integral_prize.array' => '奖品名称格式有误',
            'integral_prize.*.model_id.required' => '奖品关联ID必须',
            'integral_prize.*.model_id.integer' => '奖品关联ID格式有误',
            'integral_prize.*.model_type.integer' => '奖品类型格式有误',
            'integral_prize.*.name.required' => '奖品名称必须',
            'integral_prize.*.name.integer' => '奖品名称格式有误',
            'integral_prize.*.value.required' => '奖品价值必须',
            'integral_prize.*.value.numeric' => '奖品价值格式有误',
            'integral_prize.*.recycle.integer' => '奖品回收价值格式有误',
            'integral_prize.*.quantity.required' => '奖品数量必须',
            'integral_prize.*.quantity.integer' => '奖品数量格式有误',
            'integral_prize.*.residue.required' => '奖品剩余数量必须',
            'integral_prize.*.residue.integer' => '奖品剩余数量格式有误',
            'integral_prize.*.probability.required' => '奖品中奖概率必须',
            'integral_prize.*.probability.integer' => '奖品中奖概率格式有误',
            'integral_prize.*.sort.required' => '奖品排序必须',
            'integral_prize.*.sort.integer' => '奖品排序格式有误',
        ];
    }
}
