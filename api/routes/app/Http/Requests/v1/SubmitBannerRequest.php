<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitBannerRequest extends Request
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
                    'type' => 'required|integer',
                    'img' => 'nullable|url',
                    'url' => 'nullable|string|max:255',
                    'sort' => 'required|integer',
                    'state' => 'required|integer',
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:30',
                    'type' => 'required|integer',
                    'img' => 'nullable|url',
                    'url' => 'nullable|string|max:255',
                    'sort' => 'required|integer',
                    'state' => 'required|integer',
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
            'name.required' =>'轮播名称不能为空',
            'name.string' =>'轮播名称格式有误',
            'name.max' =>'轮播名称不能大于30个字符',
            'type.required' =>'轮播类型不能为空',
            'type.integer' =>'轮播类型格式有误',
            'img.url' =>'轮播图片格式有误',
            'url.string' =>'轮播地址格式有误',
            'state.integer' =>'轮播状态格式有误',
            'sort.integer' =>'轮播排序格式有误',
        ];
    }
}
