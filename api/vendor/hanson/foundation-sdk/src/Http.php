<?php

namespace Hanson\Foundation;

use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\HandlerStack;
use Hanson\Foundation\Exception\HttpException;
use Psr\Http\Message\ResponseInterface;

/**
 * Class Http.
 */
class Http
{
    /**
     * Used to identify handler defined by client code
     * Maybe useful in the future.
     */
    const USER_DEFINED_HANDLER = 'userDefined';

    /**
     * Http client.
     *
     * @var HttpClient
     */
    protected $client;

    /**
     * The middlewares.
     *
     * @var array
     */
    protected $middlewares = [];

    protected $stack;

    /**
     * Guzzle client default settings.
     *
     * @var array
     */
    protected static $defaults = [
        'curl' => [
            CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
        ],
    ];

    /**
     * Set guzzle default settings.
     *
     * @param  array  $defaults
     */
    public static function setDefaultOptions($defaults = [])
    {
        self::$defaults = $defaults;
    }

    /**
     * Return current guzzle default settings.
     *
     * @return array
     */
    public static function getDefaultOptions()
    {
        return self::$defaults;
    }

    /**
     * GET request.
     *
     * @param  string  $url
     * @param  array  $options
     *
     * @return ResponseInterface
     *
     * @throws HttpException
     */
    public function get($url, array $options = [])
    {
        return $this->request('GET', $url, ['query' => $options]);
    }

    /**
     * POST request.
     *
     * @param  string  $url
     * @param  array  $form
     *
     * @return ResponseInterface
     */
    public function post($url, array $form = [])
    {
        return $this->request('POST', $url, ['form_params' => $form]);
    }

    /**
     * JSON request.
     *
     * @param  string  $url
     * @param        $query
     *
     * @return ResponseInterface
     */
    public function json($url, $query = [])
    {
        return $this->request('POST', $url, ['json' => $query]);
    }

    /**
     * Upload file.
     *
     * @param  string  $url
     * @param  array  $files
     * @param  array  $form
     * @param  array  $queries
     *
     * @return ResponseInterface
     */
    public function upload($url, array $queries = [], array $files = [], array $form = [])
    {
        $multipart = [];

        foreach ($files as $name => $path) {
            if (is_array($path)) {
                foreach ($path as $item) {
                    $multipart[] = [
                            'name' => $name.'[]',
                        ] + $this->fileToMultipart($item);
                }
            } else {
                $multipart[] = [
                        'name' => $name,
                    ] + $this->fileToMultipart($path);
            }
        }

        foreach ($form as $name => $contents) {
            $multipart = array_merge($multipart, $this->normalizeMultipartField($name, $contents));
        }

        return $this->request('POST', $url, ['query' => $queries, 'multipart' => $multipart]);
    }

    /**
     * @param  string  $name
     * @param  mixed  $contents
     *
     * @return array
     */
    public function normalizeMultipartField(string $name, $contents)
    {
        $field = [];
        if (!is_array($contents)) {
            return [compact('name', 'contents')];
        } else {
            foreach ($contents as $key => $value) {
                $key = sprintf('%s[%s]', $name, $key);
                $field = array_merge($field, is_array($value) ? $this->normalizeMultipartField($key, $value) : [
                    [
                        'name' => $key, 'contents' => $value
                    ]
                ]);
            }
        }
        return $field;
    }

    private function fileToMultipart($file)
    {
        if (is_array($file)) {
            return $file;
        } elseif (@file_exists($file)) {
            return ['contents' => fopen($file, 'r')];
        } elseif (filter_var($file, FILTER_VALIDATE_URL)) {
            return ['contents' => file_get_contents($file)];
        } else {
            return ['contents' => $file];
        }
    }

    /**
     * Set GuzzleHttp\Client.
     *
     * @param  \GuzzleHttp\Client  $client
     *
     * @return Http
     */
    public function setClient(HttpClient $client)
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Return GuzzleHttp\Client instance.
     *
     * @return \GuzzleHttp\Client
     */
    public function getClient()
    {
        if (!($this->client instanceof HttpClient)) {
            $this->client = new HttpClient();
        }

        return $this->client;
    }

    /**
     * Add a middleware.
     *
     * @param  callable  $middleware
     *
     * @return $this
     */
    public function addMiddleware(callable $middleware)
    {
        array_push($this->middlewares, $middleware);

        return $this;
    }

    /**
     * Return all middlewares.
     *
     * @return array
     */
    public function getMiddlewares()
    {
        return $this->middlewares;
    }

    /**
     * Make a request.
     *
     * @param  string  $url
     * @param  string  $method
     * @param  array  $options
     *
     * @return ResponseInterface
     */
    public function request($method, $url, $options = [])
    {
        $method = strtoupper($method);

        $options = array_merge(self::$defaults, $options);

        Log::debug('Client Request:', compact('url', 'method', 'options'));

        $options['handler'] = $this->getHandler();

        $response = $this->getClient()->request($method, $url, $options);

        Log::debug('API response:', [
            'Status' => $response->getStatusCode(),
            'Reason' => $response->getReasonPhrase(),
            'Headers' => $response->getHeaders(),
            'Body' => strval($response->getBody()),
        ]);

        return $response;
    }

    /**
     * Build a handler.
     *
     * @return HandlerStack
     */
    public function getHandler()
    {
        if ($this->stack) {
            return $this->stack;
        }

        $stack = HandlerStack::create();

        foreach ($this->middlewares as $middleware) {
            $stack->push($middleware);
        }

        if (isset(static::$defaults['handler']) && is_callable(static::$defaults['handler'])) {
            $stack->push(static::$defaults['handler'], self::USER_DEFINED_HANDLER);
        }

        $this->stack = $stack;

        return $stack;
    }

    public function addHandler($guzzleHandler)
    {
        $stack = $this->getHandler();

        $stack->setHandler(is_string($guzzleHandler) ? new $guzzleHandler() : $guzzleHandler);

        $this->stack = $stack;

        return $this;
    }
}
