<?php
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
namespace App\Http\Requests\v1;

use App\Http\Requests\Request;
use Illuminate\Validation\Rule;

class SubmitGoodRequest extends Request
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
                        'name' => [
                            'required',
                            Rule::unique('goods')->where(function ($query) use ($request) {
                                $query->where('deleted_at', null)->where('id', '!=', $request['id']);
                            }),
                            'bail',
                            'string',
                            'max:60',
                        ],
                        'number' => [
                            'nullable',
                            Rule::unique('goods')->where(function ($query) use ($request) {
                                $query->where('deleted_at', null)->where('id', '!=', $request['id']);
                            }),
                            'string',
                            'max:50',
                        ],
                        'type' => 'required|integer',
                        'freight_id' => 'nullable|integer',
                        'brand_id' => 'nullable|integer',
                        'inventory' => 'nullable|integer',
                        'market_price' => 'nullable|numeric',
                        'cost_price' => 'nullable|numeric',
                        'price' => 'nullable|numeric',
                        'keywords' => 'nullable|string|max:255',
                        'short_description' => 'nullable|string|max:160',
                        'category_id' => 'required',
                        'details' => 'nullable|string',
                        'img' => 'nullable|url|max:255',
                        'good_sku' => 'nullable|array',
                        'good_sku.*.img' => 'nullable|url',
                        'good_sku.*.market_price' => 'required|numeric',
                        'good_sku.*.cost_price' => 'required|numeric',
                        'good_sku.*.price' => 'required|numeric',
                        'good_sku.*.inventory' => 'required|integer',
                        'is_show' => 'required|numeric',
                        'is_recommend' => 'nullable|boolean',
                        'is_new' => 'nullable|boolean',
                        'is_hot' => 'nullable|boolean',
                        'timing' => 'nullable|date',
                        'sort' => 'required|integer',
                    ];
                } else {
                    return [
                        'name' => [
                            'required',
                            Rule::unique('goods')->where(function ($query) {
                                $query->where('deleted_at', null);
                            }),
                            'bail',
                            'string',
                            'max:60',
                        ],
                        'number' => [
                            'nullable',
                            Rule::unique('goods')->where(function ($query) {
                                $query->where('deleted_at', null);
                            }),
                            'string',
                            'max:50',
                        ],
                        'type' => 'required|integer',
                        'freight_id' => 'nullable|integer',
                        'brand_id' => 'nullable|integer',
                        'inventory' => 'nullable|integer',
                        'market_price' => 'nullable|numeric',
                        'cost_price' => 'nullable|numeric',
                        'price' => 'nullable|numeric',
                        'keywords' => 'nullable|string|max:255',
                        'short_description' => 'nullable|string|max:160',
                        'category_id' => 'required',
                        'details' => 'nullable|string',
                        'img' => 'nullable|url|max:255',
                        'good_sku' => 'nullable|array',
                        'good_sku.*.img' => 'nullable|url',
                        'good_sku.*.market_price' => 'required|numeric',
                        'good_sku.*.cost_price' => 'required|numeric',
                        'good_sku.*.price' => 'required|numeric',
                        'good_sku.*.inventory' => 'required|integer',
                        'is_show' => 'required|numeric',
                        'is_recommend' => 'nullable|boolean',
                        'is_new' => 'nullable|boolean',
                        'is_hot' => 'nullable|boolean',
                        'timing' => 'nullable|date',
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
            'name.required' => __('hint.error.not_null', ['attribute' => __('good.name')]),
            'name.string' => __('hint.error.wrong_format', ['attribute' => __('good.name')]),
            'name.unique' => __('hint.error.exist', ['attribute' => __('good.name')]),
            'name.max' => __('hint.error.max', ['attribute' => __('good.name'), 'place' => 60]),
            'number.required' => __('hint.error.not_null', ['attribute' => __('good.number')]),
            'number.string' => __('hint.error.wrong_format', ['attribute' => __('good.number')]),
            'number.unique' => __('hint.error.exist', ['attribute' => __('good.number')]),
            'number.max' => __('hint.error.max', ['attribute' => __('good.number'), 'place' => 50]),
            'type.required' => __('hint.error.not_null', ['attribute' => __('good.type')]),
            'type.integer' => __('hint.error.wrong_format', ['attribute' => __('good.type')]),
            'freight_id.integer' => __('hint.error.wrong_format', ['attribute' => __('good.freight_id')]),
            'img.required' => __('hint.error.not_null', ['attribute' => __('good.img')]),
            'img.url' => __('hint.error.wrong_format', ['attribute' => __('good.img')]),
            'img.max' => __('hint.error.max', ['attribute' => __('good.img'), 'place' => 255]),
            'market_price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.market_price')]),
            'cost_price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.cost_price')]),
            'price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.price')]),
            'inventory.integer' => __('hint.error.wrong_format', ['attribute' => __('good.inventory')]),
            'keywords.string' => __('hint.error.wrong_format', ['attribute' => __('good.keywords')]),
            'keywords.max' => __('hint.error.max', ['attribute' => __(''), 'place' => 255]),
            'short_description.string' => __('hint.error.wrong_format', ['attribute' => __('good.short_description')]),
            'short_description.max' => __('hint.error.max', ['attribute' => __('good.short_description'), 'place' => 160]),
            'category_id.required' => __('hint.error.not_null', ['attribute' => __('good.category_id')]),
            'brand_id.integer' => __('hint.error.wrong_format', ['attribute' => __('good.brand_id')]),
            'good_sku.*.img.url' => __('hint.error.wrong_format', ['attribute' => __('good.good_sku.img')]),
            'good_sku.*.market_price.required' => __('hint.error.not_null', ['attribute' => __('good.good_sku.market_price')]),
            'good_sku.*.market_price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.good_sku.market_price')]),
            'good_sku.*.cost_price.required' => __('hint.error.not_null', ['attribute' => __('good.good_sku.cost_price')]),
            'good_sku.*.cost_price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.good_sku.cost_price')]),
            'good_sku.*.price.required' => __('hint.error.not_null', ['attribute' => __('good.good_sku.price')]),
            'good_sku.*.price.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.good_sku.price')]),
            'good_sku.*.inventory.required' => __('hint.error.not_null', ['attribute' => __('good.good_sku.inventory')]),
            'good_sku.*.inventory.numeric' => __('hint.error.wrong_format', ['attribute' => __('good.good_sku.inventory')]),
            'is_show.required' => __('hint.error.not_null', ['attribute' => __('good.is_show')]),
            'is_show.integer' => __('hint.error.wrong_format', ['attribute' => __('good.is_show')]),
            'is_recommend.required' => __('hint.error.not_null', ['attribute' => __('good.is_recommend')]),
            'is_recommend.boolean' => __('hint.error.wrong_format', ['attribute' => __('good.is_recommend')]),
            'is_new.required' => __('hint.error.not_null', ['attribute' => __('good.is_new')]),
            'is_new.boolean' => __('hint.error.wrong_format', ['attribute' => __('good.is_new')]),
            'is_hot.required' => __('hint.error.not_null', ['attribute' => __('good.is_hot')]),
            'is_hot.boolean' => __('hint.error.wrong_format', ['attribute' => __('good.is_hot')]),
            'sort.required' => __('hint.error.not_null', ['attribute' => __('common.sort')]),
            'sort.integer' => __('hint.error.wrong_format', ['attribute' => __('common.sort')]),
        ];
    }
}
