<?php

namespace App\Http\Requests\v1;


use App\Http\Requests\Request;
use Illuminate\Support\Facades\Validator;

class SubmitAdminRequest extends Request
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
            default: {
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
                        'name' => 'nullable|unique:admins,name,' . $request['id'] . '|string|max:30',
                        'real_name' => 'nullable|string|max:75',
                        'email' => 'nullable|email|max:255',
                        'cellphone' => 'nullable|mobile|max:11',
                        'portrait' => 'nullable|string|max:50',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:admins|string|max:30',
                        'real_name' => 'nullable|string|max:75',
                        'email' => 'nullable|email|max:255',
                        'cellphone' => 'nullable|mobile|max:11',
                        'portrait' => 'nullable|string|max:50',
                        'password' => 'required|string|max:255',
                    ];
                }
            case 'GET':
            default: {
                    return [];
                }
        }
    }

    public function messages()
    {
        return [
            'name.required' => __('hint.error.not_null', ['attribute' => __('requests.admin.name')]),
            'name.unique' => __('hint.error.exist', ['attribute' => __('requests.admin.name')]),
            'name.max' => __('hint.error.exceed', ['attribute' => __('requests.admin.name'), 'place' => 30]),
            'email.email' => __('hint.error.email', ['attribute' => __('requests.admin.email')]),
            'cellphone.mobile' => __('hint.error.mobile', ['attribute' => __('requests.admin.cellphone')]),
            'cellphone.max' => __('hint.error.exceed', ['attribute' => __('requests.admin.cellphone'), 'place' => 11]),
            'portrait.max' => __('hint.error.exceed', ['attribute' => __('requests.admin.portrait'), 'place' => 50]),
            'password.required' => __('hint.error.not_null', ['attribute' => __('requests.admin.password')]),
        ];
    }
}
