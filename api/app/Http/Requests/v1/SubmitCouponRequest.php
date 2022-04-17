<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitCouponRequest extends Request
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
                return [
                    'name' => 'required|string|max:30',
                    'cost' => 'required|integer',
                    'type' => 'required|integer',
                    'amount' => 'nullable|integer',
                    'sill' => 'nullable|integer',
                ];
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
            'name.required' => '优惠券名称不能为空',
            'name.string' => '优惠券名称格式有误',
            'name.max' => '优惠券名称不能大于30个字符',
            'cost.required' => '优惠券价值不能为空',
            'cost.integer' => '优惠券价值格式有误',
            'type.required' => '优惠券类型不能为空',
            'type.integer' => '优惠券类型格式有误',
            'amount.integer' => '数量格式有误',
            'residue.integer' => '剩余数量有误',
            'sill.integer' => '门槛格式有误',
        ];
    }
}
