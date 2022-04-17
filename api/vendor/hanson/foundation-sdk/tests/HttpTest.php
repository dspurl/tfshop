<?php

namespace Hanson\Foundation;

use GuzzleHttp\Handler\MockHandler;
use PHPUnit\Framework\TestCase;

class HttpTest extends TestCase
{
    public function testAddHandler()
    {
        $http = new Http();

        $stack = $http->addHandler(new MockHandler());

        var_dump($stack);
    }
}

