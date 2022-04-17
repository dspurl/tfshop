<?php

namespace Qbhy\TtMicroApp;

/**
 * Class Factory
 * @package Qbhy\TtMicroApp
 * @mixin TtMicroApp
 */
class Factory
{
    protected $config;

    protected $drivers;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function make(?string $name = null, ?array $config = null)
    {
        $name = $name ?? $this->getDefaultDriver();

        if (empty($this->config['drivers'][$name])) {
            throw new TtMicroAppException("Undefined {$name} configuration");
        }

        $config = $config ?? $this->config['drivers'][$name];

        if (!isset($config['debug'])) {
            $config['debug'] = $this->config['debug'] ?? false;
        }

        return $this->drivers[$name] ?? $this->drivers[$name] = new TtMicroApp($config);
    }

    public function getDefaultDriver()
    {
        return $this->config['default'] ?? 'default';
    }

    public function __call($name, $arguments)
    {
        $app = $this->make();

        if (method_exists($app, $name)) {
            return call_user_func_array([$app, $name], $arguments);
        }

        throw new TtMicroAppException("Undefined {$name} method!");
    }
}