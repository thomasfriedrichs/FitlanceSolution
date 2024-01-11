using Fitlance.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Fitlance.Services;

public interface IAuthenticationService
{
    Task<string> Register(RegisterRequest request, HttpResponse response);

    Task<string> Login(LoginRequest request, HttpResponse response);

    Task<ActionResult> Logout(string userId, HttpResponse response);
}