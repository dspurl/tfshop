<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var string[]
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var string[]
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @param Throwable $exception
     * @return \Illuminate\Http\Response
     * @throws Throwable
     */
    public function render($request, Throwable $exception)
    {
        $error = $this->convertExceptionToResponse($exception);
        $response['status_code'] = $error->getStatusCode();
        $response['code'] = $exception->getCode();
        $response['message'] = empty($exception->getMessage()) ? 'something error' : $exception->getMessage();
        if(config('app.debug')) {
            if($error->getStatusCode() >= 500) {
                if(config('app.debug')) {
                    $response['trace'] = $exception->getTraceAsString();

                }
            }
        }
        $response['result'] = 'error';
        return response()->json($response, $error->getStatusCode());
    }
}
