﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

using Fitlance.Data;
using Fitlance.Entities;

namespace Fitlance.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(FitlanceContext context, UserManager<User> userManager) : ControllerBase
{
    private readonly FitlanceContext _context = context;
    private readonly UserManager<User> _userManager = userManager;

    // GET: api/Users
    [Authorize(Policy = "UserRights")]
    [HttpGet]
    [ProducesResponseType(typeof(Array), 200)]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return Ok(await _context.Users.ToListAsync());
    }

    // GET: api/Users/FindTrainers
    [Authorize(Policy = "UserRights")]
    [HttpGet]
    [Route("FindTrainers")]
    [ProducesResponseType(typeof(Array), 200)]
    public async Task<ActionResult<IEnumerable<User>>> FindTrainers()
    {
        var trainers = await _context.Users
                                 .Where(u => u.Trainer != null)
                                 .Include(u => u.Trainer)
                                 .Select(u => new TrainerDTO
                                 {
                                     Id = u.Id,
                                     UserName = u.UserName,
                                     Email = u.Email,
                                     CreateTime = u.CreateTime,
                                     FirstName = u.FirstName,
                                     LastName = u.LastName,
                                     City = u.City,
                                     ZipCode = u.ZipCode,
                                     Bio = u.Bio,
                                     Gender = u.Trainer.Gender,
                                     Specialization = u.Trainer.Specialization,
                                     NutritionCertification = u.Trainer.NutritionCertification,
                                     YearsOfExperience = u.Trainer.YearsOfExperience,
                                     Rating = u.Trainer.Rating,
                                     HourlyRate = u.Trainer.HourlyRate,
                                     SecondLanguage = u.Trainer.SecondLanguage,
                                     ReviewCount = u.Trainer.ReviewCount,
                                     ActiveClients = u.Trainer.ActiveClients,
                                     Certifications = u.Trainer.Certifications,
                                     Availability = u.Trainer.Availability,
                                     ClientSkill = u.Trainer.ClientSkill
                                 })
                                 .ToListAsync();

        return Ok(trainers);
    }

    // GET: api/User/5
    [Authorize(Policy = "UserRights")]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<User>> GetUser(string id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    // PUT: api/User/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [Authorize(Policy = "UserRights")]
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutUser(string id, [FromBody] User user)
    {
        var account = _context.Users.Find(id);

        try
        {
            var DbUser = _context.Users.SingleOrDefault(e => e.Id == id);

            if (DbUser is null)
            {
                return NotFound("User not Found");
            }

            DbUser.FirstName = user.FirstName;
            DbUser.LastName = user.LastName;
            DbUser.City = user.City;
            DbUser.ZipCode = user.ZipCode;
            DbUser.Bio = user.Bio;

            _context.Entry(DbUser).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(DbUser);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return BadRequest();
            }
            else
            {
                throw;
            }
        }
    }

    // DELETE: api/User/5
    [Authorize(Policy = "UserRights")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool UserExists(string id)
    {
        return _context.Users.Any(e => e.Id == id);
    }
}