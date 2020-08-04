<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitListTemplatesRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules=[
            'title' => 'bail|required|string|max:120',
        ];
        return $rules;
    }

    public function messages()
    {
        return [
            'title.required' =>'标题不能为空',

        ];
    }


}
