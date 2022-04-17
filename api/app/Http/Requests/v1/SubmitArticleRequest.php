<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\Request;

class SubmitArticleRequest extends Request
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
                        'name' => 'required|unique:articles,name,' . $request['id'] . '|string|max:60',
                        'column_id' => 'required|array',
                        'keyword' => 'nullable|string|max:255',
                        'describes' => 'nullable|string|max:255',
                        'template' => 'required|string|max:60',
                        'is_show' => 'required|numeric',
                        'sort' => 'required|numeric',
                    ];
                } else {
                    return [
                        'name' => 'required|unique:articles|string|max:60',
                        'column_id' => 'required|array',
                        'keyword' => 'nullable|string|max:255',
                        'describes' => 'nullable|string|max:255',
                        'template' => 'required|string|max:255',
                        'is_show' => 'required|numeric',
                        'sort' => 'required|numeric',
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
            'name.required' => '文章名称不能为空',
            'name.unique' => '文章名称已存在',
            'name.string' => '文章名称格式有误',
            'name.max' => '文章名称长度不能超过60位',
            'column_id.required' => '上级类目不能为空',
            'column_id.unique' => '上级类目格式有误',
            'keyword.max' => '关键字长度不能超过255位',
            'describes.max' => '描述长度不能超过255位',
            'template.max' => '描述长度不能超过60位',
            'is_show.required' => '是否显示不能为空',
            'is_show.numeric' => '是否显示格式有误',
            'sort.required' => '排序不能为空',
            'sort.numeric' => '排序格式有误',
        ];
    }
}
