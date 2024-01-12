using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Fitlance.Services;
using Fitlance.Dtos;

namespace Fitlance.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthenticationService authenticationService) : ControllerBase
{
    private readonly IAuthenticationService _authenticationService = authenticationService;

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var httpResponse = HttpContext.Response;
            var response = await _authenticationService.Login(request, httpResponse);

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var httpResponse = HttpContext.Response;
        var response = await _authenticationService.Register(request, httpResponse);

        return Ok(response);
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Logout(string userId)
    {
        try
        {
            var httpResponse = HttpContext.Response;
            await _authenticationService.Logout(userId, httpResponse);

            return Ok(new { message = "Logged out successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RefreshToken()
    {
        var httpResponse = HttpContext.Response;
        var httpRequest = HttpContext.Request;

        var (IsSuccess, Message) = await _authenticationService.RefreshToken(httpRequest, httpResponse);

        if (IsSuccess)
        {
            return Ok(new { message = Message });
        }
        else
        {
            return Unauthorized(new { message = Message });
        }
    }
}