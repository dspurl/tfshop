<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitColumnRequest extends Request
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
                    'name' => 'required|string|max:60',
                    'pid' => 'required|numeric',
                    'keyword' => 'nullable|string|max:255',
                    'describes' => 'nullable|string|max:255',
                    'show' => 'required|numeric',
                    'list' => 'required|numeric',
                    'sort' => 'required|numeric',
                ];
            case 'PUT': //update
                return [
                    'name' => 'required|string|max:60',
                    'pid' => 'required|numeric',
                    'keyword' => 'nullable|string|max:255',
                    'describes' => 'nullable|string|max:255',
                    'show' => 'required|numeric',
                    'list' => 'required|numeric',
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

        ];
    }
}
