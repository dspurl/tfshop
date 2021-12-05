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
                        'api' => 'required|unique:auth_rules,api,' . $request['id'] . '|alpha|max:255',
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
                        'sort' => 'required|integer',
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
                        'sort' => 'required|integer',
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
            'title.required' => '权限名称不能为空',
            'title.unique' => '权限名称已存在',
            'title.max' => '权限名称不能超过50个字符',
            'api.required' =>'别名不能为空',
            'api.alpha' => '别名只能是字母',
            'api.max' => '别名不能超过255个字符'
        ];
    }
}
