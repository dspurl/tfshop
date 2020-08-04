<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitGoodIndentRequest extends Request
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
                    'address' => 'required|array',
                    'carriage' => 'required|numeric',
                    'indentCommodity' => 'required|array',
                    'indentCommodity.*.price' => 'required|numeric',
                    'indentCommodity.*.number' => 'required|integer',
                    'indentCommodity.*.name' => 'required|string',
                    'indentCommodity.*.good_id' => 'required|integer',
                    'indentCommodity.*.good_sku_id' => 'nullable|integer',
                    'indentCommodity.*.img' => 'required|string',
                    'remark' => 'nullable|string|max:200',
                ];
            case 'PUT': //update
                return [
                    'address' => 'required|array',
                    'carriage' => 'required|numeric',
                    'indentCommodity' => 'required|array',
                    'indentCommodity.*.price' => 'required|numeric',
                    'indentCommodity.*.number' => 'required|integer',
                    'indentCommodity.*.name' => 'required|string',
                    'indentCommodity.*.good_id' => 'required|integer',
                    'indentCommodity.*.good_sku_id' => 'nullable|integer',
                    'indentCommodity.*.img' => 'required|string',
                    'remark' => 'nullable|string|max:200',
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

        ];
    }
}
