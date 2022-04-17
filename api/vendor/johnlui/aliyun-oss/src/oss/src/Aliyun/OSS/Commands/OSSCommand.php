<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\OSS\Commands;

use Aliyun\OSS\ResponseHandlers\OSSErrorResponseHandler;

use Aliyun\OSS\Models\OSSOptions;

use Aliyun\OSS\Utilities\OSSResponseParserFactory;

use Aliyun\Common\Communication\HttpResponse;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\OSS\Auth\OSSRequestSigner;

use Aliyun\Common\Communication\ExecutionContext;

use Aliyun\Common\Communication\Command;
/**
 * {@inheritdoc }
 */
abstract class OSSCommand extends Command {

    protected function checkOptions($options) {
        $options = parent::checkOptions($options);
        AssertUtils::assertSet(array(
                OSSOptions::ENDPOINT,
                OSSOptions::ACCESS_KEY_ID,
                OSSOptions::ACCESS_KEY_SECRET,
        ), $options);
        return $options;
    }
    
    /**
     * 返回处理response的handlers
     * 子类可以重载此函数
     * @return 处理response的handlers
     */
    protected function getResponseHandlers($options) {
        return array(
            new OSSErrorResponseHandler(),
        );
    }

    protected function getContext($options) {
        $context = new ExecutionContext();
        $context->setCredentials(array(
            OSSOptions::ACCESS_KEY_ID => $options[OSSOptions::ACCESS_KEY_ID],
            OSSOptions::ACCESS_KEY_SECRET => $options[OSSOptions::ACCESS_KEY_SECRET],
        ));
        $context->setResponseHandler($this->getResponseHandlers($options));
        $bucket = isset($options[OSSOptions::BUCKET]) ? $options[OSSOptions::BUCKET] : null;
        $key = isset($options[OSSOptions::KEY]) ? $options[OSSOptions::KEY] : null;
        $context->setSigner(new OSSRequestSigner($bucket, $key));

        $context->setParameter('Command', $this->getCommandName());

        return $context;
    }

    private function  getCommandName() {
        $class = get_class($this);

        $classSections = explode("\\", $class);

        if (count($classSections) <= 0) {
            throw new \ErrorException('Can not parse command class.');
        }

        $className = $classSections[count($classSections) - 1];

        if (substr($className, -7) != 'Command' || strlen($className) <= 7) {
            throw new \ErrorException('Command name error.');
        }

        return substr($className, 0, -7);
    }
    
    protected function parseResponse(HttpResponse $response, $options) {
        return OSSResponseParserFactory::factory()
                                        ->createParser($this->getName())
                                        ->parse($response, $options);
    }
 
}
