<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports "GD Library" and "Imagick" to process images
    | internally. You may choose one of them according to your PHP
    | configuration. By default PHP's "GD Library" implementation is used.
    |
    | Supported: "gd", "imagick"
    | specification: 图片规格，修改此处后，可通过前端的specification来决定需要生成的图片规格;
    |
    */

    'driver' => 'gd',
    'specification' => env('IMAGE_SPECIFICATION', [80, 150, 200, 250, 300, 350]),

];
