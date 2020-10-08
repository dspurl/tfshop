<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
class SubmitAuthRuleRequest extends Request
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
                    'title' => 'bail|required|string|max:30',
                    'api' => 'nullable|unique:auth_rules|string|max:200',
                    'pid' => 'required|array',
                ];
            case 'PUT': //update
                $request = Request::all();
                return [
                    'title' => 'bail|required|string|max:30',
                    'api' => 'nullable|unique:auth_rules,api,'.$request['id'].'|string|max:200',
                    'pid' => 'required|array',
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
            'title.required' => __('hint.error.not_null',['specification'=>__('hint.routine.permissions_name')]),
            'title.unique' => __('hint.error.exist',['specification'=>__('hint.routine.permissions_name')]),
            'title.max' => __('hint.error.exceed',['specification'=>__('hint.routine.permissions_name'),'place'=>30]),
            'api.unique' => __('hint.error.exist',['specification'=>__('hint.routine.api')]),
            'api.max' => __('hint.error.exceed',['specification'=>__('hint.routine.api'),'place'=>200]),
            'pid.required' => __('hint.error.select',['specification'=>__('hint.routine.grouping')]),
        ];
    }
}
