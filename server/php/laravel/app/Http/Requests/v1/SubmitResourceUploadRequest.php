<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitResourceUploadRequest extends Request
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
                        'uuid' => 'required|uuid',
                    ];
                } else {
                    return [
                        'uuid' => 'required|uuid',
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
            'uuid.required' => __('hint.error.not_null', ['attribute' => __('requests.resource_upload.uuid')]),
            'uuid.uuid' => __('hint.error.uuid', ['attribute' => __('requests.resource_upload.uuid')]),
        ];
    }
}
