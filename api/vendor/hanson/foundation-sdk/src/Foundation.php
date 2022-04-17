<?php


namespace Hanson\Foundation;


use Doctrine\Common\Cache\Cache;
use Doctrine\Common\Cache\FilesystemCache;
use Monolog\Handler\HandlerInterface;
use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Pimple\Container;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class Foundation
 * @property-read Http $http
 * @package Hanson\Foundation
 */
class Foundation extends Container
{

    /**
     * an array of service providers.
     *
     * @var
     */
    protected $providers = [];

    protected $config;

    public function __construct($config)
    {
        parent::__construct();

        $this->setConfig($config);

        if ($this->config['debug'] ?? false) {
            error_reporting(E_ALL);
        }

        $this->registerBase();
        $this->registerProviders();
        $this->initializeLogger();
    }

    /**
     * Register basic providers.
     */
    private function registerBase()
    {
        $this['request'] = function () {
            return Request::createFromGlobals();
        };

        $this['http'] = function () {
            return new Http();
        };

        if ($cache = $this->getConfig()['cache'] ?? null and $cache instanceof Cache) {
            $this['cache'] = $this->getConfig()['cache'];
        } else {
            $this['cache'] = function () {
                return new FilesystemCache(sys_get_temp_dir());
            };
        }
    }

    /**
     * Initialize logger.
     */
    private function initializeLogger()
    {
        if (Log::hasLogger()) {
            return;
        }

        $logger = new Logger($this->getConfig()['log']['name'] ?? 'foundation');

        if (!$this->getConfig()['debug'] ?? false || defined('PHPUNIT_RUNNING')) {
            $logger->pushHandler(new NullHandler());
        } elseif (($this->getConfig()['log']['handler'] ?? null) instanceof HandlerInterface) {
            $logger->pushHandler($this->getConfig()['log']['handler']);
        } elseif ($logFile = $this->getConfig()['log']['file'] ?? null) {
            $logger->pushHandler(new StreamHandler(
                $logFile,
                $this->getConfig()['log']['level'] ?? Logger::WARNING,
                true,
                $this->getConfig()['log']['permission'] ?? null
            ));
        }

        Log::setLogger($logger);
    }

    /**
     * Register providers.
     */
    protected function registerProviders()
    {
        foreach ($this->providers as $provider) {
            $this->register(new $provider());
        }
    }

    public function setConfig(array $config)
    {
        $this->config = $config;
    }

    public function getConfig($key = null)
    {
        return $key ? ($this->config[$key] ?? null) : $this->config;
    }

    /**
     * Magic get access.
     *
     * @param  string  $id
     *
     * @return mixed
     */
    public function __get($id)
    {
        return $this->offsetGet($id);
    }

    /**
     * Magic set access.
     *
     * @param  string  $id
     * @param  mixed  $value
     */
    public function __set($id, $value)
    {
        $this->offsetSet($id, $value);
    }

    public function rebind(string $id, $value)
    {
        $this->offsetUnset($id);
        $this->offsetSet($id, $value);

        return $this;
    }
}
