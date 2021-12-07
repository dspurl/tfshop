<?php
return [
    /*
    |--------------------------------------------------------------------------
    | Prompt message language package
    |--------------------------------------------------------------------------
    |
    |
    */
    // Error
    'error' => [
        'nonentity'         =>  ':attribute does not exist',
        'falseness'         =>  ':attribute is not correct',
        'mistake'           =>  ':attribute error',
        'not_null'          =>  ':attribute cannot be empty',
        'exist'             =>  ':attribute exists',
        'exceed'            =>  ':attribute cannot exceed :place',
        'uploading'         =>  ':attribute must be uploaded',
        'illegality'        =>  'Illegal:specification',
        'distribution'      =>  'Please assign: specification',
        'configuration'     =>  'Please configure:specification',
        'select'            =>  'Please select:specification',
        'key_wrong'         =>  ':specification The key is incorrect',
        'alpha'             =>  ':attribute can be only letters',
        'accepted'          =>  ':attribute must be "yes", "on", 1, or true',
        'active_url'        =>  ':attribute must have valid A or AAAA records',
        'after'             =>  'Must be the date corresponding to the value after:attribute',
        'after_or_equal'    =>  'Must be after :attribute or the same as the given date',
        'before'            =>  'Must be the date corresponding to the value before:attribute',
        'date_equals'       =>  'Must be equal to the given date',
        'before_or_equal'   =>  'Must precede :attribute or be the same as the given date',
        'alpha_dash'        =>  ':attribute contains only letters, digits, dashes (-), and underscores (_).',
        'alpha_num'         =>  ':attribute consists of only letters and numbers',
        'array'             =>  ':attribute must be an array',
        'between'           =>  'It must be between :min and :max',
        'boolean'           =>  ':attribute must be true, false, 1, 0, "1", and "0"',
        'confirmed'         =>  ':attribute Must have the matching field confirmation',
        'date'              =>  ':attribute must be a valid date',
        'date_format'       =>  'Must match the given format (date format)',
        'different'         =>  ':attribute must be different from the value of the given field field',
        'dimensions'        =>  ':attribute must be an image and the image proportion must conform to the rule'

    ],
    // Succeed
    'succeed' => [
        'win'           =>  ':attribute success',
    ],
    // System
    'system' => [
        'login_timeout'                         =>  'Login timed out. Please log in again',
        'incorrect_permission_configuration'    =>  'Incorrect permission configuration',
        'account_has_no_permission'             =>  'The account has no permission',
        'permission_is_not_configured'          =>  'The permission is not configured',
    ]
];
