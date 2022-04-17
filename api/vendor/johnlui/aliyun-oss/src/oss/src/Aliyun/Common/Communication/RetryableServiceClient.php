<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\Common\Communication;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\Common\Models\ServiceOptions;

class RetryableServiceClient {

    private $client;

    private $maxErrotRetry;

    public function __construct(ServiceClientInterface $client, array $config = array()) {
        AssertUtils::assertSet(ServiceOptions::MAX_ERROR_RETRY, $config);
        $this->client = $client;
        $this->maxErrotRetry = $config[ServiceOptions::MAX_ERROR_RETRY];
    }

    public function sendRequest(HttpRequest $request, ExecutionContext $context) {
        return $this->sendRequestImpl($request, $context, 0);
    }

    private function sendRequestImpl(HttpRequest $request, ExecutionContext $context, $retries) {
        try {
            return $this->client->sendRequest($request, $context);
        } catch (\Exception $ex) {
            if ($this->shouldRetry($request, $ex, $retries)) {
                $request->rewind();
                $retries ++;
                $this->pause($request, $ex, $retries);
                return $this->sendRequestImpl($request, $context, $retries);
            }
            throw $ex;
        }
    }

    private function pause(HttpRequest $request, \Exception $ex, $retries) {
        return 0;
    }

    private function shouldRetry(HttpRequest $request, \Exception $ex, $retries) {
        if ($retries > $this->maxErrotRetry) {
            return false;
        }

        if (!$request->seekable()) {
            return false;
        }

        // not retry now.
        return false;

    }

}