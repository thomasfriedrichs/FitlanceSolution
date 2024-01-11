namespace Fitlance.Middleware;
public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<RequestLoggingMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        context.Request.EnableBuffering();

        var request = await FormatRequest(context.Request);
        _logger.LogInformation("Request Body: {RequestBody}", request);

        // Reset the request body stream position to the beginning
        context.Request.Body.Position = 0;

        await _next(context);
    }

    private static async Task<string> FormatRequest(HttpRequest request)
    {
        request.Body.Position = 0;
        var reader = new StreamReader(request.Body);
        var body = await reader.ReadToEndAsync();
        request.Body.Position = 0;
        return body;
    }
}