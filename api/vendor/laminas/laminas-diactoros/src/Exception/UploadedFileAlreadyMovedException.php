<?php

declare(strict_types=1);

namespace Laminas\Diactoros\Exception;

use RuntimeException;
use Throwable;

class UploadedFileAlreadyMovedException extends RuntimeException implements ExceptionInterface
{
    public function __construct(
        string $message = 'Cannot retrieve stream after it has already moved',
        $code = 0,
        Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
