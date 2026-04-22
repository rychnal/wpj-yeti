<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::EXCEPTION, method: 'onException')]
class ExceptionListener
{
    public function onException(ExceptionEvent $event): void
    {
        $throwable  = $event->getThrowable();
        $statusCode = $throwable instanceof HttpExceptionInterface
            ? $throwable->getStatusCode()
            : Response::HTTP_INTERNAL_SERVER_ERROR;

        $event->setResponse(new JsonResponse($this->formatError($throwable), $statusCode));
    }

    private function formatError(\Throwable $throwable): array
    {
        return ['error' => $throwable->getMessage()];
    }
}
