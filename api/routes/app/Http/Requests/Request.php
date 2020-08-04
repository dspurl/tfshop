<?php

namespace App\Http\Requests;

use App\Code;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

class Request extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        throw (new HttpResponseException(response()->json([
            'code' => Code::CODE_PARAMETER_WRONG,
            'message' => current(current($validator->errors()))[0],
        ],Response::HTTP_UNAUTHORIZED)));
    }
}
