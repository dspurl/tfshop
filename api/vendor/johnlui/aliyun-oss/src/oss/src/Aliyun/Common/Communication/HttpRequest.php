<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\Common\Communication;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\Common\Utilities\HttpMethods;

class HttpRequest extends HttpMessage {

	/**
	 * URI for http service.
	 * @var string 
	 */
	protected $endpoint;
	
	/**
	 * Method for http request.
	 * @var string
	 */
	protected $method = HttpMethods::GET;
	
	/**
	 * Query path of http request.
	 * @var string
	 */
	protected $resourcePath;
	
	/**
	 * Query params 
	 * @var array
	 */
	protected $parameters = array();
	
	/**
	 * The content for request body
	 * @var mixed
	 */
	protected $content;

    /**
     * The original position of the content.
     * @var integer
     */
    protected $originalContentPosition = -1;


    /**
     * @var HttpResponse
     */
    protected $response;

    /**
     * @var string|resource
     */
    protected $responseBody;

	
	public function getEndpoint() {
		return $this->endpoint;
	}
	
	public function setEndpoint($endpoint) {
        $urlParameters = parse_url($endpoint);
        if ($urlParameters === false) {
            throw new \InvalidArgumentException('Invalid endpoint: '.$endpoint.'.');
        }

        if (!isset($urlParameters['scheme'])) {
            throw new \InvalidArgumentException('The scheme of endpoint is not set.');
        }

        if (!isset($urlParameters['host'])) {
            throw new \InvalidArgumentException('The host of endpoint is not set.');
        }

        if ($urlParameters['scheme'] !== 'http' && $urlParameters['scheme'] !== 'https') {
            throw new \InvalidArgumentException('The scheme of endpoint must be http or https');
        }

		$this->endpoint = $urlParameters['scheme'].'://'.$urlParameters['host'];
	}
	
	public function getResourcePath() {
		return $this->resourcePath;
	}
	
	public function setResourcePath($resourcePath) {
	    AssertUtils::assertString($resourcePath, 'resourcePath');
	    AssertUtils::assertNotEmpty($resourcePath, 'resourcePath');
	    if (substr($resourcePath, 0, 1) != '/') {
	        throw new \InvalidArgumentException('Resource path must start with /');
	    }
		$this->resourcePath = $resourcePath;
	}
	
	public function getMethod() {
		return $this->method;
	}
	
	public function setMethod($method) {
		$allowMethods = array(
			HttpMethods::GET,
            HttpMethods::PUT,
            HttpMethods::POST,
            HttpMethods::DELETE,
            HttpMethods::HEAD,
		);
		
		if (!in_array($method, $allowMethods)) {
		    throw new \InvalidArgumentException("Http method '{$method}' is not allowed.");
		}
		
		if (in_array($method, $allowMethods)) {
			$this->method = strtoupper($method); 
		}
	}
	
	public function getParameters() {
		return $this->parameters;
	}
	
	public function addParameter($key, $value) {
	    AssertUtils::assertString($key, 'HttpParameterName');
	    if ($value !== null) {
	        AssertUtils::assertString($value, 'HttpParameterValue');
	    }
		$this->parameters[$key] = $value;
	}

    /**
     * @return The full url of http request.
     */
    public function getFullUrl() {
        $fullUrl =  $this->endpoint.$this->resourcePath;
        $parameterString = $this->getParameterString();
        if (!empty($parameterString)) {
            $fullUrl .='?'.$parameterString;
        }
        return $fullUrl;
    }

    /**
     * @param \Aliyun\Common\Communication\HttpResponse $response
     */
    public function setResponse($response) {
        $this->response = $response;
    }

    /**
     * @return \Aliyun\Common\Communication\HttpResponse
     */
    public function getResponse() {
        return $this->response;
    }

    /**
     * @return string parameter string
     */
    public function getParameterString() {
        $sections = array();
        foreach ($this->parameters as $key => $value) {
            $section = rawurlencode($key);
            if ($value !== null) {
                $section .= '=';
                $section .= rawurlencode($value);
            }
            $sections[] = $section;
        }
        return join('&', $sections);
    }

    public function isParameterInUrl() {
        return ($this->content !== null) || ($this->method !== HttpMethods::POST);
    }

    public function getResponseBody() {
        return $this->responseBody;
    }

    public function setResponseBody($responseBody) {
        $this->responseBody = $responseBody;
    }
}

