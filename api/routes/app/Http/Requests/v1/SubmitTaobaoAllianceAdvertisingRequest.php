<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitTaobaoAllianceAdvertisingRequest extends Request
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
                    'promotion_scene_id' => 'required|numeric',
                    'img' => 'required|string',
                    'starttime' => 'required|string',
                    'endtime' => 'required|string',
                    'sort' => 'required|numeric',
                ];
            case 'PUT': //update
                return [
                    'promotion_scene_id' => 'required|numeric',
                    'img' => 'required|string',
                    'starttime' => 'required|string',
                    'endtime' => 'required|string',
                    'sort' => 'required|numeric',
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
            'promotion_scene_id.required' =>'活动ID不能为空',
            'img.required' =>'图片地址不能为空',
            'starttime.required' =>'开始时间不能为空',
            'endtime.required' =>'结束时间不能为空',
            'sort.required' =>'排序不能为空',
        ];
    }
}
