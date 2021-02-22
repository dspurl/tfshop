<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitShippingRequest extends Request
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
        switch ($this->method()) {
            case 'POST':    //create
                return [
                    'cellphone' => 'required|numeric',
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
            'cellphone.required' => '手机号必须',
            'name.required' => '联系人必须',
            'location.required' => '地址必须',
            'latitude.required' => '纬度必须',
            'longitude.required' => '经度必须',
            'house.required' => '门牌号必须',
        ];
    }
}
