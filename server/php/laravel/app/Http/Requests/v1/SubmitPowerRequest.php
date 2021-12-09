<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitPowerRequest extends Request
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
                        'title' => 'bail|required|string|max:50',
                        'api' => 'nullable|unique:auth_rules,api,' . $request['id'] . '|alpha|max:255',
                        'path' => 'nullable|string|max:255',
                        'active' => 'nullable|string|max:255',
                        'redirect_url' => 'nullable|string|max:255',
                        'icon' => 'nullable|string|max:255',
                        'color' => 'nullable|string|max:7',
                        'type' => 'required|integer',
                        'is_hidden' => 'required|boolean',
                        'is_hidden_breadcrumb' => 'required|boolean',
                        'is_affix' => 'required|boolean',
                        'is_full_page' => 'required|boolean',
                        'sort' => 'nullable|integer',
                    ];
                } else {
                    return [
                        'title' => 'bail|required|string|max:50',
                        'api' => 'nullable|unique:auth_rules|alpha|max:255',
                        'path' => 'nullable|string|max:255',
                        'active' => 'nullable|string|max:255',
                        'redirect_url' => 'nullable|string|max:255',
                        'icon' => 'nullable|string|max:255',
                        'color' => 'nullable|string|max:7',
                        'type' => 'required|integer',
                        'is_hidden' => 'nullable|boolean',
                        'is_hidden_breadcrumb' => 'nullable|boolean',
                        'is_affix' => 'nullable|boolean',
                        'is_full_page' => 'nullable|boolean',
                        'sort' => 'nullable|integer',
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
            'title.required' => __('hint.error.not_null',['attribute'=>__('requests.power.title')]),
            'title.unique' => __('hint.error.exist',['attribute'=>__('requests.power.title')]),
            'title.max' => __('hint.error.exceed',['attribute'=>__('requests.power.title'),'place'=>50]),
            'api.required' =>__('hint.error.not_null',['attribute'=>__('requests.power.api')]),
            'api.unique' => __('hint.error.exist',['attribute'=>__('requests.power.api')]),
            'api.alpha' => __('hint.error.alpha',['attribute'=>__('requests.power.api')]),
            'api.max' => __('hint.error.exceed',['attribute'=>__('requests.power.api'),'place'=>255])
        ];
    }
}
