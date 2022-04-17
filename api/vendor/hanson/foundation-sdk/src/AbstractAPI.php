<?php

namespace Hanson\Foundation;

use Psr\Http\Message\RequestInterface;

abstract class AbstractAPI
{

    /**
     * Http instance.
     *
     * @var Http
     */
    protected $http;

    /**
     * @return Http
     */
    public function getHttp()
    {
        if (is_null($this->http)) {
            $this->http = new Http();
        }

        if (count($this->http->getMiddlewares()) === 0) {
            $this->middlewares();
        }

        return $this->http;
    }

    /**
     * add headers.
     *
     * @param $headers
     *
     * @return \Closure
     */
    protected function headerMiddleware($headers)
    {
        return function (callable $handler) use ($headers) {
            return function (RequestInterface $request, array $options) use ($handler, $headers) {
                foreach ($headers as $key => $header) {
                    $request = $request->withHeader($key, $header);
                }

                return $handler($request, $options);
            };
        };
    }

    /**
     * Push guzzle middleware before request.
     *
     * @return mixed
     */
    public function middlewares()
    {
    }
}
