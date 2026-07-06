<?php

namespace App\Http\Middleware;

use App\Models\FhirLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FhirLogger
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $requestBody = null;
        if ($request->method() !== 'GET') {
            $raw1 = $request->getContent();
            $raw2 = file_get_contents('php://input');
            $raw = $raw1 ?: $raw2;
            \Illuminate\Support\Facades\Log::debug('FHIR BODY DEBUG', [
                'getContent_len' => strlen($raw1),
                'php_input_len' => strlen($raw2),
                'content_type' => $request->header('Content-Type'),
                'method' => $request->method(),
                'path' => $request->path(),
            ]);
            $request->attributes->set('_raw_body', $raw);
            $requestBody = $raw ? json_decode($raw, true) : null;
        }

        $response = $next($request);

        $duration = (int) ((microtime(true) - $start) * 1000);

        if (str_starts_with($request->path(), 'api/fhir')) {
            FhirLog::create([
                'method' => $request->method(),
                'endpoint' => $request->path(),
                'request_headers' => $request->headers->all(),
                'request_body' => $requestBody,
                'response_status' => $response->getStatusCode(),
                'response_headers' => $response->headers->all(),
                'response_body' => json_decode($response->getContent(), true),
                'duration_ms' => $duration,
                'ip_address' => $request->ip(),
            ]);
        }

        return $response;
    }
}
