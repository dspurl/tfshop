<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\Common\Communication;

use Aliyun\Common\Exceptions\ClientException;

use Aliyun\Common\Exceptions\ServiceException;

abstract class Command {
	/**
	 * 用于发送请求的client
	 * @var \Aliyun\Common\Communication\ServiceClientInterface
	 */
	protected $service;

    protected $name;

	public function __construct($name) {
	    $this->name = $name;
	}
	
	public function getName() {
	    return $this->name;
	}
	
	public function getService() {
		return $this->service;
	}
	
	public function setService($service) {
		$this->service = $service;
	}

    /**
     * 在执行Command后是否关闭request流，默认为关闭
     * 子类可以覆盖此方法
     *
     * @return boolean 如果返回true，则执行Command后不关闭输出流，否则关闭输出流。
     */
    protected function leaveRequestOpen($options) {
        return false;
    }
	
	/**
	 * 在执行Command后是否关闭response流，默认为关闭
	 * 子类可以覆盖此方法
	 * 
	 * @return boolean 如果返回true，则执行Command后不关闭输出流，否则关闭输出流。
	 */
	protected function leaveResponseOpen($options) {
		return false;
	}

    /**
     * 返回此Command默认的参数
     * 子类可以覆盖此方法
     *
     * @return array
     */
    protected function commandOptions() {
        return array();
    }

    /**
     * 在获取结果后执行的动作，默认直接返回解析的结果，
     * 子类可以覆盖此方法自定义一些处理
     *
     * @param $result 解析的结果
     * @param $options 用户输入的参数
     * @return mixed
     */
    protected function afterResult($result, $options) {
        return $result;
    }
	
	/**
	 * 检查传入参数是否合法，并返回规范的参数，子类必须实现此方法
	 * @param $args 传入的参数
     * @return array 返回的options
	 */
	protected function checkOptions($options) {
        return $options;
    }
	
	/**
	 * 根据传入参数转换成client的HttpRequest，子类必须实现此方法
	 * @param $args 传入的参数
	 * @return HttpRequest
	 */
	abstract protected function getRequest($options);
	
	/**
	 * 根据传入参数转换成client的context.子类必须实现此方法
	 * @param $args 传入的参数
	 * @return 用于client发送的context
	 */
	abstract protected function getContext($options);
	
	/**
	 * 解析response
	 * @param $response HttpResponse。
	 * @return 解析后的结果
	 */
	abstract protected function parseResponse(HttpResponse $response, $options);
	
	public function execute($clientOptions, $userOptions) {
        $request = null;
        $response = null;
        $result = null;
        $options = $this->checkOptions(array_merge($clientOptions, $this->commandOptions(), $userOptions));
        try {
            $context = $this->getContext($options);
            $request = $this->getRequest($options);

            $response = $this->service->sendRequest($request, $context);

            $result = $this->afterResult($this->parseResponse($response, $options), $options);

            $this->handleStream($request, $response, $options);

        } catch (\Exception $ex) {

            $this->handleStream($request, $response, $options);

            if ($ex instanceof ServiceException || $ex instanceof ClientException) {
                throw $ex;
            }

            throw new ClientException($ex->getMessage(), $ex);
        }

        return $result;
	}

    private function handleStream($request, $response, $options) {
        if (!$this->leaveResponseOpen($options) && $response instanceof HttpResponse) {
            $response->close();
        }

        if (!$this->leaveRequestOpen($options) && $request instanceof HttpRequest) {
            $request->close();
        }
    }
}
