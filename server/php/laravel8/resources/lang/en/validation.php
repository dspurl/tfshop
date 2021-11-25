<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'The :specification must be accepted.',
    'active_url' => 'The :specification is not a valid URL.',
    'after' => 'The :specification must be a date after :date.',
    'after_or_equal' => 'The :specification must be a date after or equal to :date.',
    'alpha' => 'The :specification may only contain letters.',
    'alpha_dash' => 'The :specification may only contain letters, numbers, dashes and underscores.',
    'alpha_num' => 'The :specification may only contain letters and numbers.',
    'array' => 'The :specification must be an array.',
    'before' => 'The :specification must be a date before :date.',
    'before_or_equal' => 'The :specification must be a date before or equal to :date.',
    'between' => [
        'numeric' => 'The :specification must be between :min and :max.',
        'file' => 'The :specification must be between :min and :max kilobytes.',
        'string' => 'The :specification must be between :min and :max characters.',
        'array' => 'The :specification must have between :min and :max items.',
    ],
    'boolean' => 'The :specification field must be true or false.',
    'confirmed' => 'The :specification confirmation does not match.',
    'date' => 'The :specification is not a valid date.',
    'date_equals' => 'The :specification must be a date equal to :date.',
    'date_format' => 'The :specification does not match the format :format.',
    'different' => 'The :specification and :other must be different.',
    'digits' => 'The :specification must be :digits digits.',
    'digits_between' => 'The :specification must be between :min and :max digits.',
    'dimensions' => 'The :specification has invalid image dimensions.',
    'distinct' => 'The :specification field has a duplicate value.',
    'email' => 'The :specification must be a valid email address.',
    'exists' => 'The selected :specification is invalid.',
    'file' => 'The :specification must be a file.',
    'filled' => 'The :specification field must have a value.',
    'gt' => [
        'numeric' => 'The :specification must be greater than :value.',
        'file' => 'The :specification must be greater than :value kilobytes.',
        'string' => 'The :specification must be greater than :value characters.',
        'array' => 'The :specification must have more than :value items.',
    ],
    'gte' => [
        'numeric' => 'The :specification must be greater than or equal :value.',
        'file' => 'The :specification must be greater than or equal :value kilobytes.',
        'string' => 'The :specification must be greater than or equal :value characters.',
        'array' => 'The :specification must have :value items or more.',
    ],
    'image' => 'The :specification must be an image.',
    'in' => 'The selected :specification is invalid.',
    'in_array' => 'The :specification field does not exist in :other.',
    'integer' => 'The :specification must be an integer.',
    'ip' => 'The :specification must be a valid IP address.',
    'ipv4' => 'The :specification must be a valid IPv4 address.',
    'ipv6' => 'The :specification must be a valid IPv6 address.',
    'json' => 'The :specification must be a valid JSON string.',
    'lt' => [
        'numeric' => 'The :specification must be less than :value.',
        'file' => 'The :specification must be less than :value kilobytes.',
        'string' => 'The :specification must be less than :value characters.',
        'array' => 'The :specification must have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'The :specification must be less than or equal :value.',
        'file' => 'The :specification must be less than or equal :value kilobytes.',
        'string' => 'The :specification must be less than or equal :value characters.',
        'array' => 'The :specification must not have more than :value items.',
    ],
    'max' => [
        'numeric' => 'The :specification may not be greater than :max.',
        'file' => 'The :specification may not be greater than :max kilobytes.',
        'string' => 'The :specification may not be greater than :max characters.',
        'array' => 'The :specification may not have more than :max items.',
    ],
    'mimes' => 'The :specification must be a file of type: :values.',
    'mimetypes' => 'The :specification must be a file of type: :values.',
    'min' => [
        'numeric' => 'The :specification must be at least :min.',
        'file' => 'The :specification must be at least :min kilobytes.',
        'string' => 'The :specification must be at least :min characters.',
        'array' => 'The :specification must have at least :min items.',
    ],
    'not_in' => 'The selected :specification is invalid.',
    'not_regex' => 'The :specification format is invalid.',
    'numeric' => 'The :specification must be a number.',
    'present' => 'The :specification field must be present.',
    'regex' => 'The :specification format is invalid.',
    'required' => 'The :specification field is required.',
    'required_if' => 'The :specification field is required when :other is :value.',
    'required_unless' => 'The :specification field is required unless :other is in :values.',
    'required_with' => 'The :specification field is required when :values is present.',
    'required_with_all' => 'The :specification field is required when :values are present.',
    'required_without' => 'The :specification field is required when :values is not present.',
    'required_without_all' => 'The :specification field is required when none of :values are present.',
    'same' => 'The :specification and :other must match.',
    'size' => [
        'numeric' => 'The :specification must be :size.',
        'file' => 'The :specification must be :size kilobytes.',
        'string' => 'The :specification must be :size characters.',
        'array' => 'The :specification must contain :size items.',
    ],
    'starts_with' => 'The :specification must start with one of the following: :values',
    'string' => 'The :specification must be a string.',
    'timezone' => 'The :specification must be a valid zone.',
    'unique' => 'The :specification has already been taken.',
    'uploaded' => 'The :specification failed to upload.',
    'url' => 'The :specification format is invalid.',
    'uuid' => 'The :specification must be a valid UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "specification.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given specification rule.
    |
    */

    'custom' => [
        'specification-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our specification placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
