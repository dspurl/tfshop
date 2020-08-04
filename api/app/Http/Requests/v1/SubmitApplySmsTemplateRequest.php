<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitApplySmsTemplateRequest extends Request
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
                    'type' => 'required|numeric',
                    'sms_scenario_id' => 'required|numeric',
                    'name' => 'required|string|max:30',
                    'contents' => 'required|string|max:500',
                    'code' => 'required|string|unique:apply_sms_templates|max:300'
                ];
            case 'PUT': //update
                $request = Request::all();
                return [
                    'type' => 'required|numeric',
                    'sms_scenario_id' => 'required|numeric',
                    'name' => 'required|string|max:30',
                    'contents' => 'required|string|max:500',
                    'code' => 'required|string|unique:apply_sms_templates,code,'.$request['id'].'|max:300'
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
            'type.required' =>'请选择模板类型',
            'sms_scenario_id.required' =>'请选择应用场景',
            'name.required' =>'请填写模板名称',
            'contents.required' =>'请填写模板内容',
            'code.required' =>'请填写模版CODE',
            'code.unique' =>'模版CODE已存在',
        ];
    }
}
