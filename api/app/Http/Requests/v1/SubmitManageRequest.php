<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
class SubmitManageRequest extends Request
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
                        'roles' => 'bail|required|string|max:11',
                        'introduction' => 'required|string|max:80',
                        'rules' => 'required',
                    ];
                } else {
                    return [
                        'roles' => 'bail|required|unique:auth_groups|string|max:11',
                        'introduction' => 'required|string|max:80',
                        'rules' => 'required',
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
            'roles.required' => __('hint.error.not_null',['specification'=>__('hint.routine.character')]),
            'roles.unique' => __('hint.error.exist',['specification'=>__('hint.routine.character')]),
            'roles.max' => __('hint.error.exceed',['specification'=>__('hint.routine.character'),'place'=>11]),
            'introduction.required' => __('hint.error.not_null',['specification'=>__('hint.routine.describe')]),
            'introduction.max' => __('hint.error.exceed',['specification'=>__('hint.routine.describe'),'place'=>80]),
            'rules.required' => __('hint.error.distribution',['specification'=>__('hint.routine.permissions')]),
        ];
    }
}
