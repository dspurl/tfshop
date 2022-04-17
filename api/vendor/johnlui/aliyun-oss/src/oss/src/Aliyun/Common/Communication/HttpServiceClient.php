<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\Common\Communication;

use Aliyun\Common\Exceptions\ClientException;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\Common\Utilities\HttpHeaders;

use Aliyun\Common\Models\ServiceOptions;

use Guzzle\Common\Event;

use Aliyun\Common\Communication\ServiceClientInterface;

use Guzzle\Http\EntityBody;

use Guzzle\Http\Message\EntityEnclosingRequest;

use Guzzle\Http\ReadLimitEntityBody;

class HttpServiceClient implements ServiceClientInterface {
	/**
	 * @var \Guzzle\Http\Client.
	 */
	protected $client;

	public function __construct($config = array()) {

        // Create internal client.
		$this->client = new \Guzzle\Http\Client(null, array(
		    'curl.options' => $config[ServiceOptions::CURL_OPTIONS],
        ));

        // Strict redirect.
        $this->client->getConfig()->set('request.params', array(
            'redirect.strict' => true
        ));

        // Stop error dispatcher.
		$this->client->getEventDispatcher()->addListener('request.error', function(Event $event) {
			$event->stopPropagation();
		});
	}
	
	public function sendRequest(HttpRequest $request, ExecutionContext $context) {
        $response = new HttpResponse($request);
        try {

            $coreRequest = $this->buildCoreRequest($request);
            $coreResponse = $coreRequest->send();
            $coreResponse->getBody()->rewind();

            $response->setStatusCode($coreResponse->getStatusCode());
            $response->setUri($coreRequest->getUrl());
            $response->setContent($coreResponse->getBody()->getStream());

            // Replace resource of Guzzle Stream to forbidden resource close when Stream is released.
            $fakedResource = fopen('php://memory', 'r+');
            if ($coreResponse->getBody() !== null) {
                $coreResponse
                    ->getBody()
                    ->setStream($fakedResource);
            }

            // If request has entity, replace resource of Guzzle Stream to forbidden resource close when Stream is released.
            if ($coreRequest instanceof EntityEnclosingRequest && $coreRequest->getBody() !== null) {
                $coreRequest
                    ->getBody()
                    ->setStream($fakedResource);
            }

            fclose($fakedResource);

            for ($iter = $coreResponse->getHeaders()->getIterator();
                    $iter->valid();
                    $iter->next()) {

                $header = $iter->current();
                $response->addHeader($header->getName(), (string) $header);
            }

            $request->setResponse($response);
            return $response;
        } catch (\Exception $e) {
            $response->close();
            throw new ClientException($e->getMessage(), $e);
        }
	}
	
	protected function buildCoreRequest(HttpRequest $request) {

        $headers = $request->getHeaders();
        $contentLength = 0;
        if (!$request->isParameterInUrl()) {
            $body = $request->getParameterString();
            $contentLength = strlen($body);
        } else {
            $body = $request->getContent();
            if ($body !== null) {
                AssertUtils::assertSet(HttpHeaders::CONTENT_LENGTH, $headers);
                $contentLength = (int) $headers[HttpHeaders::CONTENT_LENGTH];
            }
        }

        $entity = null;
        $headers[HttpHeaders::CONTENT_LENGTH] = (string) $contentLength;
        if ($body !== null) {
            $entity = new ReadLimitEntityBody(EntityBody::factory($body), $contentLength,
                $request->getOffset() !== false ? $request->getOffset() : 0);
        }

        $coreRequest = $this->client->createRequest($request->getMethod(), $request->getFullUrl(), $headers, $entity);

        if ($request->getResponseBody() != null) {
            $coreRequest->setResponseBody($request->getResponseBody());
        }

        return $coreRequest;
	}
}
