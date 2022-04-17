<?php

declare(strict_types=1);

namespace Laminas\Diactoros\Exception;

use RuntimeException;
use Throwable;

class InvalidStreamPointerPositionException extends RuntimeException implements ExceptionInterface
{
    public function __construct(
        string $message = 'Invalid pointer position',
        $code = 0,
        Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
