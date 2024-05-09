<?php
/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
use Illuminate\Support\Facades\Validator;

class SubmitShippingRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        Validator::extend('mobile', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^1[3456789][0-9]{9}$/', $value);
        });
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
        switch ($this->method()) {
            case 'POST':    //create
                return [
                    'cellphone' => 'required|mobile',
                    'name' => 'required|string|max:30',
                    'location' => 'required|string|max:255',
                    'address' => 'nullable|string|max:255',
                    'latitude' => 'required|numeric',
                    'longitude' => 'required|numeric',
                    'house' => 'required|string|max:255',
                ];
            case 'PUT':
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
            'cellphone.required' => __('hint.error.not_null', ['attribute' => __('shipping.cellphone')]),
            'cellphone.mobile' => __('hint.error.wrong_format', ['attribute' => __('shipping.cellphone')]),
            'name.required' => __('hint.error.not_null', ['attribute' => __('shipping.name')]),
            'name.string' => __('hint.error.wrong_format', ['attribute' => __('shipping.name')]),
            'name.max' => __('hint.error.max', ['attribute' => __('shipping.name'), 'place' => 30]),
            'location.required' => __('hint.error.not_null', ['attribute' => __('shipping.location')]),
            'location.string' => __('hint.error.wrong_format', ['attribute' => __('shipping.location')]),
            'location.max' => __('hint.error.max', ['attribute' => __('shipping.location'), 'place' => 255]),
            'address.string' => __('hint.error.wrong_format', ['attribute' => __('shipping.address')]),
            'address.max' => __('hint.error.max', ['attribute' => __('shipping.address'), 'place' => 255]),
            'latitude.required' => __('hint.error.not_null', ['attribute' => __('shipping.latitude')]),
            'latitude.numeric' => __('hint.error.wrong_format', ['attribute' => __('shipping.latitude')]),
            'longitude.required' => __('hint.error.not_null', ['attribute' => __('shipping.longitude')]),
            'longitude.numeric' => __('hint.error.wrong_format', ['attribute' => __('shipping.longitude')]),
            'house.required' => __('hint.error.not_null', ['attribute' => __('shipping.house')]),
            'house.string' => __('hint.error.wrong_format', ['attribute' => __('shipping.house')]),
            'house.max' => __('hint.error.max', ['attribute' => __('shipping.house'), 'place' => 255]),
        ];
    }
}
