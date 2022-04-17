<?php

namespace Hanson\Foundation;

use Doctrine\Common\Cache\Cache;
use Doctrine\Common\Cache\FilesystemCache;

abstract class AbstractAccessToken
{
    /**
     * App id.
     *
     * @var string
     */
    protected $appId;

    /**
     * App secret.
     *
     * @var string
     */
    protected $secret;

    /**
     * Cache key.
     *
     * @var string
     */
    protected $cacheKey;

    /**
     * Cache.
     *
     * @var Cache
     */
    protected $cache;

    /**
     * Cache key prefix.
     *
     * @var string
     */
    protected $prefix;

    /**
     * Response Json key name of token.
     *
     * @var string
     */
    protected $tokenJsonKey;

    /**
     * Response Json key name of expires in.
     *
     * @var string
     */
    protected $expiresJsonKey;

    /**
     * @var Http
     */
    protected $http;

    /**
     * @var Foundation
     */
    protected $app;

    /**
     * Token string.
     *
     * @var string
     */
    protected $token;

    /**
     * AbstractAccessToken constructor.
     * @param  Foundation  $app
     */
    public function __construct(Foundation $app)
    {
        $this->app = $app;
    }

    /**
     * @param  mixed  $token
     * @param  int  $expires
     * @return $this
     */
    public function setToken($token, $expires = 86400)
    {
        if ($expires) {
            $this->getCache()->save($this->getCacheKey(), $token, $expires);
        }

        $this->token = $token;

        return $this;
    }

    /**
     * Get token from cache.
     *
     * @param  bool  $forceRefresh
     *
     * @return string
     */
    public function getToken($forceRefresh = false)
    {
        $cached = $this->getCache()->fetch($this->getCacheKey()) ?: $this->token;

        if ($forceRefresh || empty($cached)) {

            $result = $this->getTokenFromServer();

            $this->checkTokenResponse($result);

            $this->setToken(
                $token = $result[$this->tokenJsonKey],
                $this->expiresJsonKey ? $result[$this->expiresJsonKey] : null
            );

            return $token;
        }

        return $cached;
    }

    /**
     * Get token from remote server.
     *
     * @return mixed
     */
    abstract public function getTokenFromServer();

    /**
     * Throw exception if token is invalid.
     *
     * @param $result
     * @return mixed
     */
    abstract public function checkTokenResponse($result);

    /**
     * @param  mixed  $appId
     */
    public function setAppId($appId)
    {
        $this->appId = $appId;
    }

    /**
     * @return mixed
     */
    public function getAppId()
    {
        return $this->appId;
    }

    /**
     * @param  string  $secret
     */
    public function setSecret($secret)
    {
        $this->secret = $secret;
    }

    /**
     * @return mixed
     */
    public function getSecret()
    {
        return $this->secret;
    }

    /**
     * Set cache instance.
     *
     * @param  \Doctrine\Common\Cache\Cache  $cache
     *
     * @return AbstractAccessToken
     */
    public function setCache(Cache $cache)
    {
        $this->cache = $cache;

        return $this;
    }

    /**
     * Return the cache manager.
     *
     * @return \Doctrine\Common\Cache\Cache
     */
    public function getCache()
    {
        return $this->cache ?: $this->cache = new FilesystemCache(sys_get_temp_dir());
    }

    /**
     * Return the cache key mix with appId.
     *
     * @return string
     */
    public function getCacheKey()
    {
        if (is_null($this->cacheKey)) {
            return $this->prefix.$this->appId;
        }

        return $this->cacheKey;
    }

    /**
     * Return the http instance.
     *
     * @return Http
     */
    public function getHttp()
    {
        return $this->http ?? $this->app->http;
    }

    /**
     * Set the http instance.
     *
     * @param  Http  $http
     *
     * @return $this
     */
    public function setHttp($http)
    {
        $this->http = $http;

        return $this;
    }
}
