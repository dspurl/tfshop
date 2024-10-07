<?php

namespace Qbhy\TtMicroApp\Hyperf;

use Hyperf\Contract\ConfigInterface;
use Qbhy\TtMicroApp\TtMicroApp;
use \Qbhy\TtMicroApp\Factory as BaseFactory;

/**
 * Class Factory
 * @package Qbhy\TtMicroApp
 * @mixin TtMicroApp
 */
class Factory extends BaseFactory
{
    protected $config;

    protected $drivers;

    public function __construct(ConfigInterface $config)
    {
        parent::__construct($config->get('tt-app', []));
    }

    public function make(?string $name = null, ?array $config = null)
    {
        $app = parent::make($name);

        // 协程环境下，支持自定义 guzzle handler
        if (class_exists('Hyperf\Guzzle\CoroutineHandler')) {
            $app->rebind('guzzle_handler', 'Hyperf\Guzzle\CoroutineHandler');
        }

        return $app;
    }
}