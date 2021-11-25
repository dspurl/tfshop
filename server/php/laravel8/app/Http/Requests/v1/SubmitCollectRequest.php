<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitCollectRequest extends Request
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
        switch ($this->method())
        {
            case 'POST':
                return [
                    'id' => 'required|integer',
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
            'id.required' =>'商品ID不能为空',
            'id.integer' =>'商品ID格式有误',
        ];
    }
}
